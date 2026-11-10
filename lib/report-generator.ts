import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportConfig {
  periodo?: string;
  dataInicio?: string;
  dataFim?: string;
  tipo?: 'completo' | 'financeiro' | 'operacional';
  categorias?: string[];
  incluirObservacoes?: boolean;
}

export interface ReportMonthlyData {
  name: string;
  valor: number;
}

export interface ReportCategoryData {
  name: string;
  value: number;
  desc?: string;
}

export async function generateReluzReportPDF(
  monthlyData: ReportMonthlyData[],
  categoriesData: ReportCategoryData[],
  config: ReportConfig = {}
): Promise<string> {
  // Formata o período de acordo com datas específicas ou texto
  let periodo = config.periodo;
  if (!periodo && config.dataInicio && config.dataFim) {
    const formatBr = (d: string) => {
      const parts = d.split('-');
      return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : d;
    };
    periodo = `${formatBr(config.dataInicio)} a ${formatBr(config.dataFim)}`;
  } else if (!periodo) {
    periodo = 'Jan 2026 - Nov 2026';
  }

  const tipo = config.tipo || 'completo';
  const incluirObs = config.incluirObservacoes ?? true;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Cabeçalho estilizado (Marca Reluz)
  doc.setFillColor(24, 24, 27); // zinc-900
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Faixa dourada decorativa
  doc.setFillColor(245, 158, 11); // amber-500
  doc.rect(0, 36, pageWidth, 2, 'F');

  // Nome da Empresa
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(245, 158, 11);
  doc.text('RELUZ', 14, 16);

  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('ESTÉTICA AUTOMOTIVA', 44, 16);

  // Subtítulo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(161, 161, 170); // zinc-400
  const tipoLabel = 
    tipo === 'financeiro' ? 'Relatório Financeiro e Faturamento' :
    tipo === 'operacional' ? 'Relatório de Operações e Serviços' :
    'Relatório Gerencial de Desempenho e Faturamento';
  doc.text(tipoLabel, 14, 25);

  // Metadados do documento (alinhados à direita)
  const now = new Date();
  const dataEmissao = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  doc.setFontSize(8);
  doc.setTextColor(212, 212, 216);
  doc.text(`Emissão: ${dataEmissao}`, pageWidth - 14, 16, { align: 'right' });
  doc.text(`Período: ${periodo}`, pageWidth - 14, 22, { align: 'right' });
  doc.text('Status: Consolidado', pageWidth - 14, 28, { align: 'right' });

  let currentY = 46;

  // 2. Indicadores Principais (KPIs)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(24, 24, 27);
  doc.text('INDICADORES PRINCIPAIS (KPIS)', 14, currentY);

  currentY += 4;
  const kpis = [
    { label: 'TICKET MÉDIO', val: 'R$ 245,00', sub: '+5% vs anterior', show: tipo !== 'operacional' },
    { label: 'CRESCIMENTO', val: '18.4%', sub: '+2.1% no mês', show: true },
    { label: 'CONVERSÃO', val: '64%', sub: 'Estável', show: true },
    { label: 'NPS (SATISFAÇÃO)', val: '98 / 100', sub: 'Excelente', show: true },
  ];

  const visibleKpis = kpis.filter(k => k.show);
  const cardWidth = (pageWidth - 28 - ((visibleKpis.length - 1) * 4)) / visibleKpis.length;

  visibleKpis.forEach((kpi, index) => {
    const cardX = 14 + index * (cardWidth + 4);
    
    // Fundo do card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, currentY, cardWidth, 20, 2, 2, 'FD');

    // Barra superior dourada
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(cardX, currentY, cardWidth, 1.5, 1, 1, 'F');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(113, 113, 122);
    doc.text(kpi.label, cardX + 3, currentY + 6);

    // Valor
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(24, 24, 27);
    doc.text(kpi.val, cardX + 3, currentY + 12);

    // Subtítulo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(34, 197, 94);
    doc.text(kpi.sub, cardX + 3, currentY + 17);
  });

  currentY += 27;

  // 3. Tabela de Faturamento (se tipo for completo ou financeiro)
  if (tipo === 'completo' || tipo === 'financeiro') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(24, 24, 27);
    doc.text('FATURAMENTO POR PERÍODO', 14, currentY);

    const totalFaturamento = monthlyData.reduce((acc, item) => acc + item.valor, 0);
    const mediaMensal = totalFaturamento / (monthlyData.length || 1);

    const faturamentoRows = monthlyData.map(item => {
      const perc = totalFaturamento > 0 ? ((item.valor / totalFaturamento) * 100).toFixed(1) + '%' : '0%';
      const mediaDiaria = item.valor / 30;
      return [
        item.name,
        `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `R$ ${mediaDiaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        perc
      ];
    });

    faturamentoRows.push([
      'TOTAL CONSOLIDADO',
      `R$ ${totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `R$ ${(mediaMensal / 30).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Média)`,
      '100.0%'
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [['Mês / Período', 'Faturamento Bruto', 'Média Diária', 'Representatividade']],
      body: faturamentoRows,
      theme: 'grid',
      headStyles: {
        fillColor: [24, 24, 27],
        textColor: [245, 158, 11],
        fontStyle: 'bold',
        fontSize: 8,
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.2,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      didParseCell: (dataHook) => {
        if (dataHook.row.index === faturamentoRows.length - 1) {
          dataHook.cell.styles.fontStyle = 'bold';
          dataHook.cell.styles.fillColor = [254, 243, 199];
          dataHook.cell.styles.textColor = [146, 64, 14];
        }
      }
    });

    // @ts-expect-error - lastAutoTable exists in jspdf-autotable
    currentY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : currentY + 50;
  }

  // 4. Tabela de Categorias (se tipo for completo ou operacional)
  if (tipo === 'completo' || tipo === 'operacional') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(24, 24, 27);
    doc.text('DISTRIBUIÇÃO POR CATEGORIA DE SERVIÇO', 14, currentY);

    const filteredCategories = config.categorias && config.categorias.length > 0
      ? categoriesData.filter(c => config.categorias?.includes(c.name))
      : categoriesData;

    const catRows = filteredCategories.map(c => [
      c.name,
      c.desc || 'Serviços especializados automotivos',
      `${c.value}%`
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [['Categoria', 'Descrição dos Serviços', 'Participação (%)']],
      body: catRows,
      theme: 'grid',
      headStyles: {
        fillColor: [24, 24, 27],
        textColor: [245, 158, 11],
        fontStyle: 'bold',
        fontSize: 8,
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.2,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      }
    });

    // @ts-expect-error - lastAutoTable exists in jspdf-autotable
    currentY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : currentY + 40;
  }

  // 5. Observações Executivas
  if (incluirObs && currentY < pageHeight - 35) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, pageWidth - 28, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(24, 24, 27);
    doc.text('Observações e Recomendações Estratégicas:', 18, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const obsText = 'Crescimento consolidado em 2026 com pico no último mês. Recomenda-se manter o investimento em serviços de estética detalhada e fidelização através de planos recorrentes de lavagem técnica.';
    doc.text(doc.splitTextToSize(obsText, pageWidth - 36), 18, currentY + 10.5);
  }

  // 6. Rodapé em todas as páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 10, pageWidth - 14, pageHeight - 10);
    
    doc.text('Reluz Estética Automotiva • Sistema de Gestão Interna • Documento Confidencial', 14, pageHeight - 6);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 6, { align: 'right' });
  }

  // Nome do arquivo
  const cleanPeriodo = periodo.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Relatorio_Reluz_${cleanPeriodo}_${now.toISOString().slice(0, 10)}.pdf`;
  
  // Salvar no navegador
  doc.save(fileName);
  return fileName;
}
