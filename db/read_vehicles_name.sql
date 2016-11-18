SELECT * FROM Vehicles v
JOIN Users u ON v.ownerId = u.id
WHERE u.firstname ILIKE concat('%', $1::TEXT, '%');
