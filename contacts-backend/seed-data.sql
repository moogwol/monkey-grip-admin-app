-- Add sample contacts to the database
INSERT INTO contacts (first_name, last_name, email, twitter, avatar, notes, favorite) VALUES
('John', 'Doe', 'john.doe@example.com', '@johndoe', 'https://robohash.org/john.png', 'Sample contact', false),
('Jane', 'Smith', 'jane.smith@example.com', '@janesmith', 'https://robohash.org/jane.png', 'Another sample contact', true),
('Bob', 'Johnson', 'bob.johnson@example.com', '', 'https://robohash.org/bob.png', '', false);