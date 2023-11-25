ALTER TRIGGER TG_AUTOCODE_PROPERTY_CODE
ON PROPERTY
FOR INSERT
AS
BEGIN
	DECLARE @ID INT, @MAX INT
	DECLARE @NAMHT VARCHAR(2), @MABDS VARCHAR(11)


	SET @ID = (SELECT ID FROM INSERTED)
	SET @NAMHT = RIGHT(YEAR(GETDATE()),2)
	
	IF NOT EXISTS (SELECT 1 FROM PROPERTY WHERE SUBSTRING(PROPERTY_CODE,2,2) = @NAMHT)
		SET @MAX = 1
	ELSE
		SET @MAX = (SELECT MAX(RIGHT(PROPERTY_CODE,4)) FROM PROPERTY 
				                          WHERE SUBSTRING(PROPERTY_CODE,2,2) = @NAMHT) + 1
	SET @MABDS = 'P'+ @NAMHT  + FORMAT(@MAX,'0000')
	UPDATE PROPERTY SET PROPERTY_CODE = @MABDS WHERE ID = @ID
END
--TEST
INSERT INTO [dbo].[Property] ([Property_Name], [Property_Type_ID], [Description], [District_ID], [Address], [Area], [Bed_Room], [Bath_Room], [Price], [Installment_Rate], [Avatar], [Album], [Property_Status_ID])
	VALUES ( N'NHÀ PHỐ GARDEN KHANG ĐIỀN', 3, N'Nhà xây 1 trệt, 2 lầu, hoàn thiện bên ngoài kính cường lực, sơn nước chống rêu mốc chất lượng, có cửa kính cường lực, gara ô tô để xe thoải mái.', 1, N'Dự án Melosa Garden, Quận 9, Hồ Chí Minh', 80, 2, 2, 1000000000, CAST ('7.99' AS float), N'ppc0001.jpg', N'ppc0002.jpg;ppc0003.jpg;', 6)
SELECT * FROM PROPERTY
