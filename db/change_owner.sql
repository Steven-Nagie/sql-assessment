UPDATE Vehicles
SET ownerId = $2
WHERE id = $1
RETURNING *;
