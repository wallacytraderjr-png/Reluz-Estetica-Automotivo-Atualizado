import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');
const jsonPath = path.join(process.cwd(), 'data', 'db.json');

function ensureTables(sqlite: Database.Database) {
  // Tabela sales
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      clientName TEXT,
      customerEmail TEXT,
      customerPhone TEXT,
      deliveryType TEXT,
      address TEXT,
      items TEXT,
      paymentMethod TEXT,
      total REAL,
      status TEXT,
      createdAt TEXT
    );
  `);

  // Garante colunas em sales
  const salesCols = sqlite.prepare('PRAGMA table_info(sales)').all() as Array<{ name: string }>;
  const existingSalesCols = salesCols.map(c => c.name);
  if (!existingSalesCols.includes('customerEmail')) sqlite.exec('ALTER TABLE sales ADD COLUMN customerEmail TEXT');
  if (!existingSalesCols.includes('customerPhone')) sqlite.exec('ALTER TABLE sales ADD COLUMN customerPhone TEXT');
  if (!existingSalesCols.includes('deliveryType')) sqlite.exec('ALTER TABLE sales ADD COLUMN deliveryType TEXT');
  if (!existingSalesCols.includes('address')) sqlite.exec('ALTER TABLE sales ADD COLUMN address TEXT');
  if (!existingSalesCols.includes('status')) sqlite.exec('ALTER TABLE sales ADD COLUMN status TEXT');

  // Tabela customers
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      vehicleBrand TEXT,
      vehicleModel TEXT,
      plate TEXT,
      color TEXT,
      createdAt TEXT
    );
  `);

  const custCols = sqlite.prepare('PRAGMA table_info(customers)').all() as Array<{ name: string }>;
  if (!custCols.some(c => c.name === 'email')) {
    sqlite.exec('ALTER TABLE customers ADD COLUMN email TEXT');
  }
}

function syncDbJson(newSale: any) {
  try {
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(raw);
      if (!Array.isArray(data.sales)) data.sales = [];
      data.sales.unshift(newSale);
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Erro ao sincronizar db.json no checkout:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod, total, notes } = body;

    if (!customer?.email) {
      return NextResponse.json({ error: 'O e-mail é obrigatório para confirmar o pedido.' }, { status: 400 });
    }
    if (!customer?.name) {
      return NextResponse.json({ error: 'O nome completo é obrigatório.' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Seu carrinho está vazio.' }, { status: 400 });
    }

    const sqlite = new Database(dbPath);
    ensureTables(sqlite);

    // Gerar ID do Pedido
    const orderId = `#RELUZ-${Math.floor(1000 + Math.random() * 9000)}`;

    // Montar texto descritivo dos itens
    const itemsDescription = items
      .map((item: any) => `${item.quantity}x ${item.name} (R$ ${Number(item.price).toFixed(2)})`)
      .join(', ');

    // Salvar venda
    const newSale = {
      id: orderId,
      clientName: customer.name.trim(),
      customerEmail: customer.email.trim(),
      customerPhone: customer.phone ? customer.phone.trim() : '',
      deliveryType: customer.deliveryType === 'delivery' ? 'Entrega em Domicílio' : 'Retirada na Loja',
      address: customer.deliveryType === 'delivery' ? (customer.address || '').trim() : 'Balcão / Loja Reluz',
      items: itemsDescription,
      paymentMethod: paymentMethod || 'Pix',
      total: Number(total || 0),
      status: 'Pendente',
      createdAt: new Date().toISOString()
    };

    const insertSale = sqlite.prepare(`
      INSERT INTO sales (id, clientName, customerEmail, customerPhone, deliveryType, address, items, paymentMethod, total, status, createdAt)
      VALUES (@id, @clientName, @customerEmail, @customerPhone, @deliveryType, @address, @items, @paymentMethod, @total, @status, @createdAt)
    `);
    insertSale.run(newSale);

    // Dar baixa de estoque nos produtos
    const updateStockStmt = sqlite.prepare(`
      UPDATE products 
      SET stock = MAX(0, stock - ?) 
      WHERE id = ? OR name = ?
    `);

    for (const item of items) {
      try {
        const qty = Number(item.quantity || 1);
        updateStockStmt.run(qty, item.id || '', item.name || '');
      } catch (stockError) {
        console.error(`Erro ao atualizar estoque para ${item.name}:`, stockError);
      }
    }

    // Salvar ou atualizar cliente na lista de clientes
    try {
      const existingCustomer = sqlite.prepare(`
        SELECT id FROM customers WHERE (phone != '' AND phone = ?) OR (email != '' AND email = ?)
      `).get(newSale.customerPhone, newSale.customerEmail) as { id: string } | undefined;

      if (!existingCustomer) {
        const insertCustomer = sqlite.prepare(`
          INSERT INTO customers (id, name, email, phone, address, vehicleBrand, vehicleModel, plate, color, createdAt)
          VALUES (@id, @name, @email, @phone, @address, @vehicleBrand, @vehicleModel, @plate, @color, @createdAt)
        `);
        insertCustomer.run({
          id: `cli-${Date.now()}`,
          name: newSale.clientName,
          email: newSale.customerEmail,
          phone: newSale.customerPhone,
          address: newSale.address,
          vehicleBrand: '',
          vehicleModel: '',
          plate: '',
          color: '',
          createdAt: newSale.createdAt
        });
      }
    } catch (custError) {
      console.error('Erro ao registrar cliente:', custError);
    }

    // Sincronizar com db.json
    syncDbJson(newSale);

    // Chave PIX oficial da loja para pagamento instantâneo
    const pixKey = '79988594996';
    const storePhone = '5579988594996';

    // Montar link do WhatsApp pronto para o cliente confirmar se desejar
    const message = encodeURIComponent(
      `Olá, Reluz Estética Automotiva! Acabei de fazer o pedido *${orderId}* no site.\n\n` +
      `👤 *Cliente:* ${newSale.clientName}\n` +
      `📧 *E-mail:* ${newSale.customerEmail}\n` +
      `📦 *Itens:* ${itemsDescription}\n` +
      `🚚 *Tipo:* ${newSale.deliveryType}\n` +
      `💳 *Forma de Pagamento:* ${newSale.paymentMethod}\n` +
      `💰 *Total:* R$ ${newSale.total.toFixed(2)}\n\n` +
      `Gostaria de confirmar os detalhes do meu pedido!`
    );
    const whatsappLink = `https://wa.me/${storePhone}?text=${message}`;

    return NextResponse.json({
      success: true,
      orderId,
      order: newSale,
      pixKey,
      whatsappLink
    });
  } catch (error: any) {
    console.error('Erro ao processar checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar o seu pedido. Tente novamente.' },
      { status: 500 }
    );
  }
}
