import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');
const db = new Database(dbPath);

export function getDB() {
  return {
    sales: db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='sales'").get()
      ? db.prepare('SELECT * FROM sales').all()
      : [],
    products: db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='products'").get()
      ? db.prepare('SELECT * FROM products').all()
      : [],
    appointments: db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'").get()
      ? db.prepare('SELECT * FROM appointments').all()
      : [],
    customers: db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='customers'").get()
      ? db.prepare('SELECT * FROM customers').all()
      : [],
    services: db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='services'").get()
      ? db.prepare('SELECT * FROM services').all()
      : [],
    gallery: db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='gallery'").get()
      ? db.prepare('SELECT * FROM gallery').all()
      : [],
  };
}

export function saveDB(data: any) {
  try {
    // Salvar Serviços
    if (data.services) {
      const deleteServices = db.prepare('DELETE FROM services');
      const insertService = db.prepare(`
        INSERT INTO services (id, name, description, price, imageUrl, duration, active)
        VALUES (@id, @name, @description, @price, @imageUrl, @duration, @active)
      `);

      db.transaction((items: any[]) => {
        deleteServices.run();
        for (const item of items) {
          insertService.run({
            id: item.id || `s-${Date.now()}`,
            name: item.name || '',
            description: item.description || '',
            price: Number(item.price) || 0,
            imageUrl: item.imageUrl || '',
            duration: item.duration || '1h',
            active: item.active ? 1 : 0
          });
        }
      })(data.services);
    }

    // Salvar Agendamentos (já existente)
    if (data.appointments) {
      const deleteStmt = db.prepare('DELETE FROM appointments');
      const insertStmt = db.prepare(`
        INSERT INTO appointments (id, customerName, clientName, name, phone, vehicle, serviceId, serviceName, service, date, time, status, notes, createdAt)
        VALUES (@id, @customerName, @clientName, @name, @phone, @vehicle, @serviceId, @serviceName, @service, @date, @time, @status, @notes, @createdAt)
      `);

      db.transaction((items: any[]) => {
        deleteStmt.run();
        for (const item of items) {
          insertStmt.run({
            id: item.id || `a-${Date.now()}`,
            customerName: item.customerName || item.clientName || item.name || 'Cliente',
            clientName: item.clientName || item.customerName || '',
            name: item.name || item.customerName || '',
            phone: item.phone || '',
            vehicle: item.vehicle || '',
            serviceId: item.serviceId || '',
            serviceName: item.serviceName || item.service || 'Serviço',
            service: item.service || item.serviceName || '',
            date: item.date || '',
            time: item.time || '',
            status: item.status || 'PENDING',
            notes: item.notes || '',
            createdAt: item.createdAt || new Date().toISOString()
          });
        }
      })(data.appointments);
    }
    // Salvar Galeria
    if (data.gallery) {
      const deleteGallery = db.prepare('DELETE FROM gallery');
      const insertGallery = db.prepare(`
        INSERT INTO gallery (id, category, imageUrl, description)
        VALUES (@id, @category, @imageUrl, @description)
      `);

      db.transaction((items: any[]) => {
        deleteGallery.run();
        for (const item of items) {
          insertGallery.run({
            id: item.id || `g-${Date.now()}`,
            category: item.category || 'Lavagens',
            imageUrl: item.imageUrl || '',
            description: item.description || ''
          });
        }
      })(data.gallery);
    }
  } catch (error) {
    console.error('Erro ao salvar no SQLite:', error);
  }
}