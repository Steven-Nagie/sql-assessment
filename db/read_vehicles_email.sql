SELECT * FROM Vehicles v
JOIN Users u ON v.ownerId = u.id
WHERE u.email ILIKE $1;
