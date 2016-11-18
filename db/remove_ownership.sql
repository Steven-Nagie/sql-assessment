-- ALTER TABLE Vehicles
-- DROP CONSTRAINT ownerId
-- WHERE ownerId = $2 AND id = $1;

UPDATE Vehicles
SET ownerId = NULL
WHERE ownerId = $2 AND id = $1;
