const grupos = {
    1: {
      id: 1,
      nome: "MATERIA PRIMA",
      categoria: 'compras',
      subgrupos: [
        { id: 1, nome: "POLIMEROS" },
        { id: 2, nome: "TINTAS" },
        { id: 3, nome: "MANTAS/RESINAS/MAT.FORMULACAO" }
      ]
    },
    2: { id: 2,
        nome: "INSUMOS",
        categoria: 'compras',
        subgrupos: [
          { id: 1, nome: "FRESA" },
          { id: 2, nome: "ADESIVOS" },
          { id: 3, nome: "MATERIAL AUXILAR TP" },
          { id: 4, nome: "MATERIAL AUXILIAR FV" },
          { id: 5, nome: "ABRASIVOS" },
          { id: 6, nome: "DIVERSOS - MCP" },
          { id: 7, nome: "MAR - MATERIAL AUXILIAR ROTOMOLDAGEM" },
          { id: 8, nome: "ENERGIA" }
        ]
      },
    3: { id: 3,
        nome: "MATERIAL DE EMBALAGEM",
        categoria: 'compras',
        subgrupos: [
          { id: 1, nome: "MATERIAL DE EMBALAGEM" }
         ]
        },
    4: { id: 4,
        nome: "MANUTENCAO INDUSTRIAL", 
        categoria: 'compras',
        subgrupos: [
          { id: 1, nome: "TERMO" },
          { id: 2, nome: "TERMO / FIBRA" },
          { id: 3, nome: "FIBRA" },
          { id: 4, nome: "ROTOMOLDAGEM" }
         ]
        },
    5: { id: 5, 
        nome: "USO E CONSUMO INDUSTRIAL",
        categoria: 'compras',
        subgrupos: [
          { id: 1, nome: "GERAL" },
          { id: 2, nome: "MAQUINAS E FERRAMENTAS" }
         ]
      },
    6: { id: 6,
        nome: "PRODUTOS EM ELABORAÇÃO",
        categoria: 'compras',
        subgrupos: [
          { id: 1, nome: "SEMI ACABADO TP" },
          { id: 2, nome: "SEMI ACABADO FV" },
          { id: 3, nome: "SEMI ACABADO RT" },
          { id: 4, nome: "ADM" }
        ]
    },
    7: { id: 7, 
        nome: "PRODUTO ACABADO",
        categoria: 'produção',
        subgrupos: [
          { id: 1, nome: "PRODUTO ACABADO TP" },
          { id: 2, nome: "PRODUTO ACABADO FV" },
          { id: 3, nome: "TERCEIROS" },
          { id: 4, nome: "ACR - ACABAMENTO ROTOMOLDAGEM" }
        ]
    },
    8: { id: 8, 
        nome: "FERRAMENTAL", 
        categoria: 'compras',
        subgrupos: [
          { id: 1, nome: "COMPRA" },
          { id: 2, nome: "VENDA" },
          { id: 3, nome: "GERAL" }
        ]
      },
    9: { id: 9,
      nome: "PRODUTO SEMI ACABADO",
      categoria: 'produção',
      subgrupos: [
        { id: 1, nome: "SAT - SEMI ACABADO TP" },
        { id: 2, nome: "SAF - SEMI ACABADO FV" },
        { id: 3, nome: "MTP - CHAPA PLASTICA" },
        { id: 4, nome: "MOL - MOLDAGEM" },
        { id: 5, nome: "LAM - LAMINACAO" },
        { id: 6, nome: "TIN - TINTAS" },
        { id: 7, nome: "COMPOSTO RESINA /GEL /MASSA" },
        { id: 8, nome: "MTP - INJETORA" },
        { id: 9, nome: "ROT - ROTOMOLDAGEM" },
        { id: 10, nome: "EMBALAGEM / DIVERSOS" },
        { id: 11, nome: "SAR - SEMI ACABADO RT" },
        { id: 12, nome: "MTP - ROTOMOLDAGEM" }
      ]
    },
    10: { id: 10,
      nome: "IMPRESSOS E MAT. DE ESCRITORIO", 
      categoria: 'compras',
      subgrupos: [
        { id: 1, nome: "NULO" },
        { id: 2, nome: "INFORMATICA" }
      ]
    },
    11: { id: 11,
      nome: "MATERIAL DE USO E CONSUMO",
      categoria: 'compras',
      subgrupos: [
        { id: 1, nome: "GERAL" },
        { id: 2, nome: "MATERIAL DE SEGURANÇA" },
        { id: 3, nome: "ALIMENTAÇÃO" },
        { id: 4, nome: "VEICULOS / EMPILHADEIRAS" },
        { id: 5, nome: "INSTRUMENTOS" },
        { id: 6, nome: "MAQUINAS E FERRAMENTAS" },
        { id: 7, nome: "USO E CONSUMO COM CREDITO DE PIS / COFINS" }
      ]
    },
/*     12: { id: 12,
      nome: "ATIVO IMOBILIZADO",
      categoria: 'compras',
      subgrupos: [
        { id: 1, nome: "CREDITO ICMS" },
        { id: 2, nome: "MOVEIS E UTENSILIOS" },
        { id: 4, nome: "MAQUINAS E EQUIPAMENTOS" },
        { id: 5, nome: "EQUIP. DE PROCESSAM.ELETRONICO" },
        { id: 6, nome: "VEICULOS" }
      ]
    }, */
    13: { id: 13,
      nome: "SERVICOS",
      categoria: 'compras',
      subgrupos: [
        { id: 1, nome: "INDUSTRIAL" },
        { id: 2, nome: "TRANSPORTE" },
        { id: 3, nome: "LOCAÇÃO/ALUGUEL" },
        { id: 5, nome: "ANALISES LABORATORIAIS" },
        { id: 6, nome: "LAVANDERIA" },
        { id: 7, nome: "MANUTENÇÃO" },
        { id: 8, nome: "ESCRITORIO" },
        { id: 9, nome: "AFIAÇÃO" },
        { id: 10, nome: "TEXTURIZAÇÃO" },
        { id: 11, nome: "USINAGEM" },
        { id: 12, nome: "ENERGIA ELÉTRICA" },
        { id: 13, nome: "ÁGUA/ESGOSTO" },
        { id: 14, nome: "HOSPEDAGEM" },
        { id: 15, nome: "TELEFONE" },
        { id: 16, nome: "SERVIÇOS CLÍNICOS" },
        { id: 17, nome: "SERVIÇOS PATRIMONIAIS" },
        { id: 18, nome: "FUNERÁRIA" }
      ]
    },
/*     14: { id: 14,
      nome: "PERDA",
      categoria: 'compras',
      subgrupos: [
        { id: 1, nome: "NULO" }
       ]
    }, */
    15: { id: 15, 
      nome: "DESENVOLVIMENTO",
      categoria: 'compras',
      subgrupos: [
        { id: 1, nome: "TERMO" },
        { id: 2, nome: "TERMO / FIBRA" },
        { id: 3, nome: "FIBRA" },
        { id: 4, nome: "AMOSTRAS RECEBIDAS" },
        { id: 5, nome: "ROTOMOLDAGEM" },
        { id: 6, nome: "ADM" }
      ]
    },
  };

  export default grupos;