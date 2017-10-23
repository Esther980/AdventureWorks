DROP TABLE IF EXISTS dbo.Orders;

CREATE TABLE dbo.Orders(
	OrderId int NOT NULL,
	OrderDate datetime2 NOT NULL,
	Total money NOT NULL,
	Type char(6) NOT NULL,
	ShipMethod nvarchar(50) NOT NULL
)
GO


