CREATE TRIGGER TG_AUTOCODE_FULL_CONTRACT_CODE
ON FULL_CONTRACT
FOR INSERT
AS
BEGIN
    DECLARE @ID INT, @MAX INT
    DECLARE @NAMHT VARCHAR(2), @MAHDC VARCHAR(11)

    SET @ID = (SELECT ID FROM INSERTED)
    SET @NAMHT = RIGHT(YEAR(GETDATE()), 2)

    IF NOT EXISTS (SELECT 1 FROM FULL_CONTRACT WHERE SUBSTRING(Full_Contract_Code, 3, 2) = @NAMHT)
        SET @MAX = 1
    ELSE
        SET @MAX = (SELECT MAX(CAST(RIGHT(Full_Contract_Code, 5) AS INT)) FROM FULL_CONTRACT
                    WHERE SUBSTRING(Full_Contract_Code, 3, 2) = @NAMHT) + 1
    SET @MAHDC = 'FC' + @NAMHT + RIGHT('00000' + CAST(@MAX AS VARCHAR(4)), 4)
    UPDATE FULL_CONTRACT SET Full_Contract_Code = @MAHDC WHERE ID = @ID
END
--Tét
INSERT INTO [dbo].[Full_Contract] (
    [Customer_Name], [Year_Of_Birth], [SSN], [Customer_Address], [Mobile], [Property_ID], [Date_Of_Contract], [Price], [Deposit], [Remain], [Status]
)
VALUES (
    N'Trần Công Anh', 1989, N'404948494', N'36 Lê Văn Sỹ, Quận 3, TP.HCM', N'0967686878', 2, CAST(0x5e400b AS date), 2000000000, 200000000, 1800000000, CAST ('True' AS bit)
)

SELECT * FROM FULL_CONTRACT