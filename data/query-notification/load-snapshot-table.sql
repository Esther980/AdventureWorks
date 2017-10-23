INSERT INTO dbo.Orders (OrderId, OrderDate, Total, Type, ShipMethod)
SELECT TOP 30 SalesOrderID, [OrderDate], [SubTotal], 'P', [Name]
FROM [Sales].[SalesOrderHeader] o
	JOIN [Purchasing].[ShipMethod] m ON o.ShipMethodID = m.ShipMethodID
ORDER BY NEWID() 

INSERT INTO dbo.Orders (OrderId, OrderDate, Total, Type, ShipMethod)
SELECT TOP 30 PurchaseOrderID, [OrderDate], [SubTotal], 'P', [Name]
FROM Purchasing.PurchaseOrderHeader o
	JOIN [Purchasing].[ShipMethod] m ON o.ShipMethodID = m.ShipMethodID
ORDER BY NEWID() 