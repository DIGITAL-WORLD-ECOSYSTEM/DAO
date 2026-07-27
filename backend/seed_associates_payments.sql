-- IMPORTAÇÃO DE PAGAMENTOS REAIS (PAGADOR: ANDRESSA DE LIMA FERREIRA)
-- Tabela: treasury_ledger

-- Limpando registros anteriores desta categoria para garantir dados limpos
DELETE FROM treasury_ledger WHERE category = 'membership';

INSERT INTO treasury_ledger (type, category, amount_cents, currency, description, status, created_at)
VALUES 
('inbound', 'membership', 500000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Nu Pagamentos) | Pix (Ref: 09.jpg)', 'completed', strftime('%s', '2023-08-08')),
('inbound', 'membership', 500000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Nu Pagamentos) | Pix (Ref: 09.jpg)', 'completed', strftime('%s', '2023-08-09')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Nu Pagamentos) | Pix (Ref: 27.jpg)', 'completed', strftime('%s', '2023-09-21')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Nu Pagamentos) | Pix (Ref: 24.jpg)', 'completed', strftime('%s', '2023-10-20')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Nu Pagamentos) | Pix (Ref: 28.jpg)', 'completed', strftime('%s', '2023-11-21')),
('inbound', 'membership', 70000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Bradesco) | Pix (Ref: 29.jpg / 30.pdf)', 'completed', strftime('%s', '2023-12-21')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 31.jpg / 32.jpg)', 'completed', strftime('%s', '2023-12-22')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 15.jpg)', 'completed', strftime('%s', '2024-02-16')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 12.jpg)', 'completed', strftime('%s', '2024-03-11')),
('inbound', 'membership', 70000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Bradesco) | Pix (Ref: 37.jpg / 01.pdf)', 'completed', strftime('%s', '2024-04-30')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 38.jpg)', 'completed', strftime('%s', '2024-04-30')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 36.jpg)', 'completed', strftime('%s', '2024-05-29')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 33.jpg)', 'completed', strftime('%s', '2024-06-24')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 35.pdf)', 'completed', strftime('%s', '2024-07-28')),
('inbound', 'membership', 70000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Bradesco) | Pix (Ref: 01.pdf)', 'completed', strftime('%s', '2024-09-06')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 07.jpg)', 'completed', strftime('%s', '2024-09-06')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Bradesco) | Pix (Ref: 01.pdf)', 'completed', strftime('%s', '2024-10-09')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 10.pdf)', 'completed', strftime('%s', '2024-11-09')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 22.pdf)', 'completed', strftime('%s', '2024-12-18')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 26.pdf)', 'completed', strftime('%s', '2025-01-21')),
('inbound', 'membership', 70000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Bradesco) | Pix (Ref: 25.pdf / 02.pdf)', 'completed', strftime('%s', '2025-01-21')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 11.jpg)', 'completed', strftime('%s', '2025-02-10')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 23.pdf)', 'completed', strftime('%s', '2025-03-19')),
('inbound', 'membership', 40000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Bradesco) | Pix (Ref: 21.pdf / 02.pdf)', 'completed', strftime('%s', '2025-04-18')),
('inbound', 'membership', 40000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Bradesco) | Pix (Ref: 39.pdf / 02.pdf)', 'completed', strftime('%s', '2025-04-30')),
('inbound', 'membership', 75000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 16.pdf)', 'completed', strftime('%s', '2025-05-17')),
('inbound', 'membership', 35000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Banco Inter) | Pix (Ref: 17.jpg / 03.pdf)', 'completed', strftime('%s', '2025-06-17')),
('inbound', 'membership', 80000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 18.pdf)', 'completed', strftime('%s', '2025-06-17')),
('inbound', 'membership', 66700, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Banco Inter) | Pix (Ref: 34.jpg / 03.pdf)', 'completed', strftime('%s', '2025-07-26')),
('inbound', 'membership', 66700, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Itaú Unibanco) | Pix (Ref: 04.jpg)', 'completed', strftime('%s', '2025-08-02')),
('inbound', 'membership', 66700, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Sandro Alves (Banco Inter) | Pix (Ref: 14.jpg / 03.pdf)', 'completed', strftime('%s', '2025-08-15')),
('inbound', 'membership', 100000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: Paulo Roberto (Santander) | Pix (Ref: 13.jpg)', 'completed', strftime('%s', '2025-10-13')),
('inbound', 'membership', 105000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: ASPPIBRA (Cora SCFI) | Boleto (Ref: 20.pdf / 19.pdf)', 'completed', strftime('%s', '2025-11-17')),
('inbound', 'membership', 55000, 'BRL', 'Pagador: Andressa de Lima Ferreira | Favorecido: ASPPIBRA (Cora SCFI) | Pix (Ref: 05.jpg / 06.pdf)', 'completed', strftime('%s', '2025-12-05'));
