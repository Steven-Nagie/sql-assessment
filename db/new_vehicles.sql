SELECT v.make, v.model, v.year, u.firstname, u.lastname FROM Vehicles v
JOIN Users u ON v.ownerId = u.id
WHERE v.year > 2000
ORDER BY v.year DESC;
