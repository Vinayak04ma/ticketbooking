-- =============================================
-- BookMyShow – Actual Hits Seed Data (MySQL)
-- Fixed with Verified TMDB Image URLs
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE bookings MODIFY COLUMN status VARCHAR(255);
TRUNCATE TABLE bookings;
TRUNCATE TABLE booking_seats;
TRUNCATE TABLE shows;
TRUNCATE TABLE seats;
TRUNCATE TABLE screens;
TRUNCATE TABLE theaters;
TRUNCATE TABLE movies;
TRUNCATE TABLE cities;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Cities
INSERT INTO cities (name, state) VALUES 
('Mumbai', 'Maharashtra'), ('Delhi', 'Delhi'), ('Bangalore', 'Karnataka'), 
('Hyderabad', 'Telangana'), ('Chennai', 'Tamil Nadu'), ('Pune', 'Maharashtra'), 
('Kolkata', 'West Bengal'), ('Ahmedabad', 'Gujarat');

-- 2. Users
INSERT INTO users (name, email, password, phone, created_at) VALUES 
('Rajeev Mehra', 'rajeev@example.com', '$2a$10$X5674vpy/YFq0/c5XfFfveXNf.L4g/eFzB3wT2t24G9/u11m3bI.u', '9999999999', CURRENT_TIMESTAMP),
('Vinayak', 'vinayak@gmail.com', '$2a$10$X5674vpy/YFq0/c5XfFfveXNf.L4g/eFzB3wT2t24G9/u11m3bI.u', '9876543210', CURRENT_TIMESTAMP);

-- 3. Movies (Actual Hits with Verified TMDB Posters)
INSERT INTO movies (title, description, genre, language, duration_minutes, rating, release_date, poster_url) VALUES 
('Pushpa 2: The Rule', 'The rule of Pushpa Raj.', 'Action', 'Telugu', 165, 9.2, '2024-12-05', 'https://image.tmdb.org/t/p/original/bhxZj3y59cK7JtGdV285dhDRaMe.jpg'),
('Stree 2', 'Sarkata returns to Chanderi.', 'Horror/Comedy', 'Hindi', 147, 8.5, '2024-08-15', 'https://image.tmdb.org/t/p/original/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg'),
('Kalki 2898 AD', 'The battle for the future.', 'Sci-Fi/Action', 'Telugu', 181, 8.1, '2024-06-27', 'https://image.tmdb.org/t/p/original/4P3K5medethmTlsuN7UN5bmnATq.jpg'),
('Jawan', 'A social thriller of a man determined to rectify wrongs.', 'Action', 'Hindi', 169, 7.8, '2023-09-07', 'https://image.tmdb.org/t/p/original/gTV8RAYEKDcRwn4TFbUZfRk5Nsj.jpg'),
('Animal', 'A gripping father-son obsession drama.', 'Action/Drama', 'Hindi', 201, 7.6, '2023-12-01', 'https://image.tmdb.org/t/p/original/14zedCaF044yj3at1TJ2uHpaNQD.jpg'),
('RRR', 'Tale of two legendary revolutionaries.', 'Action', 'Telugu', 187, 8.7, '2022-03-25', 'https://image.tmdb.org/t/p/original/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg'),
('Baahubali 2: The Conclusion', 'The epic conclusion to the legendary saga.', 'Action/Drama', 'Telugu', 167, 8.8, '2017-04-28', 'https://image.tmdb.org/t/p/original/21sC2assImQIYCEDA84Qh9d1RsK.jpg'),
('K.G.F: Chapter 2', 'Rocky’s supremacy challenged.', 'Action', 'Kannada', 168, 8.4, '2022-04-14', 'https://image.tmdb.org/t/p/original/au6Nq6kVr9NFICzpmYtMSyDA3Gi.jpg'),
('Kantara', 'Justice for the village through ancestral roots.', 'Action/Drama', 'Kannada', 148, 8.2, '2022-09-30', 'https://image.tmdb.org/t/p/original/lqkaDoxdKC9PhLtIfAdAVCtQTvM.jpg'),
('Vikram', 'Special Ops hunting a masked serial killer.', 'Action/Thriller', 'Tamil', 175, 8.3, '2022-06-03', 'https://image.tmdb.org/t/p/original/774UV1aCURb4s4JfEFg3IEMu5Zj.jpg'),
('Leo', 'A hero hiding from a dangerous past.', 'Action', 'Tamil', 164, 7.3, '2023-10-19', 'https://image.tmdb.org/t/p/original/t1oAdt8JjUs4sHEBvE8fKtjV7er.jpg'),
('Jailer', 'A retired jailer goes on a manhunt.', 'Action', 'Tamil', 168, 7.5, '2023-08-10', 'https://image.tmdb.org/t/p/original/p933oBZpchdX8KA29gPVKBxGlyU.jpg'),
('3 Idiots', 'Chasing excellence with Rancho.', 'Comedy/Drama', 'Hindi', 170, 8.4, '2009-12-25', 'https://image.tmdb.org/t/p/original/66A9MqXOyVFCssoloscw79z8Tew.jpg'),
('Dangal', 'The wrestling legacy.', 'Sport/Drama', 'Hindi', 161, 8.3, '2016-12-23', 'https://image.tmdb.org/t/p/original/3n8888uKuaxPBBuDUqJhfhrWlgA.jpg'),
('PK', 'A stranger logic about god.', 'Comedy/Sci-Fi', 'Hindi', 153, 8.1, '2014-12-19', 'https://image.tmdb.org/t/p/original/uqoAHhuKZnWxzXbXSUycgpLPmUW.jpg'),
('Bajrangi Bhaijaan', 'A journey of innocence across borders.', 'Drama', 'Hindi', 159, 8.1, '2015-07-17', 'https://image.tmdb.org/t/p/original/hGIlHgQC2RnS8xTlE3nuTDXanYC.jpg'),
('Drishyam 2', 'The case reopens.', 'Thriller', 'Hindi', 140, 8.2, '2022-11-18', 'https://image.tmdb.org/t/p/original/pcuGo5KfNkGhftnb1uFEXCN4Gpa.jpg'),
('Pathaan', 'Indian spy taking on a mercenary leader.', 'Action/Thriller', 'Hindi', 146, 7.1, '2023-01-25', 'https://image.tmdb.org/t/p/original/m1b97ofvnYpCH9uGguML986eUfS.jpg'),
('Gadar 2', 'Tara Singh returning for his son.', 'Action/Drama', 'Hindi', 170, 7.5, '2023-08-11', 'https://image.tmdb.org/t/p/original/unmYQ3t03AnS492iE9rWwV35N7t.jpg'),
('Pushpa: The Rise', 'The rise of a smuggler.', 'Action', 'Telugu', 179, 7.6, '2021-12-17', 'https://image.tmdb.org/t/p/original/oaRk2HgOirEeNuDCwwScmq7rKvS.jpg');

-- 4. Theaters (All Major Cities)
INSERT INTO theaters (name, address, city_id) VALUES 
('PVR Phoenix', 'Lower Parel, Mumbai', 1),
('PVR Director\'s Cut', 'Vasant Kunj, Delhi', 2),
('INOX Mantri Square', 'Malleshwaram, Bangalore', 3),
('AMB Cinemas', 'Gachibowli, Hyderabad', 4),
('Sathyam Cinemas', 'Royapettah, Chennai', 5),
('Cinepolis Westend', 'Aundh, Pune', 6),
('INOX Quest Mall', 'Ballygunge, Kolkata', 7),
('PVR Acropolis', 'Thaltej, Ahmedabad', 8);

-- 5. Screens
INSERT INTO screens (name, total_seats, theater_id) VALUES 
('IMAX 1', 150, 1),
('Screen 2', 150, 1),
('Director\'s Lounge', 150, 2),
('INOX Insignia', 150, 3),
('Screen A', 150, 4),
('Main House', 150, 5),
('VIP Screen 1', 150, 6),
('Screen Elite', 150, 7),
('Screen Gold', 150, 8);

-- 6. Shows (Auto-populated for movies across all cities)
-- Mumbai Shows (Screen 1 & 2)
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 1, CURRENT_DATE(), '10:00:00', '13:00:00', 350.00 FROM movies WHERE id <= 10;
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 2, CURRENT_DATE(), '14:30:00', '17:30:00', 400.00 FROM movies WHERE id <= 10;
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '18:00:00', '21:00:00', 450.00 FROM movies WHERE id <= 10;

-- Delhi Shows (Screen 3)
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 3, CURRENT_DATE(), '11:00:00', '14:00:00', 420.00 FROM movies WHERE id <= 15;
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 3, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '16:00:00', '19:00:00', 450.00 FROM movies WHERE id <= 15;

-- Bangalore Shows (Screen 4)
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 4, CURRENT_DATE(), '12:00:00', '15:00:00', 380.00 FROM movies WHERE id <= 15;
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 4, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '17:30:00', '20:30:00', 400.00 FROM movies WHERE id <= 15;

-- Hyderabad Shows (Screen 5)
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 5, CURRENT_DATE(), '10:30:00', '13:30:00', 320.00 FROM movies WHERE id <= 15;
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 5, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '15:00:00', '18:00:00', 350.00 FROM movies WHERE id <= 15;

-- Chennai Shows (Screen 6)
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 6, CURRENT_DATE(), '13:00:00', '16:00:00', 300.00 FROM movies WHERE id <= 15;
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 6, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '19:00:00', '22:00:00', 350.00 FROM movies WHERE id <= 15;

-- Pune Shows (Screen 7)
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 7, CURRENT_DATE(), '14:00:00', '17:00:00', 330.00 FROM movies WHERE id <= 15;

-- Kolkata Shows (Screen 8)
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 8, CURRENT_DATE(), '15:30:00', '18:30:00', 300.00 FROM movies WHERE id <= 15;

-- Ahmedabad Shows (Screen 9)
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, ticket_price)
SELECT id, 9, CURRENT_DATE(), '16:00:00', '19:00:00', 320.00 FROM movies WHERE id <= 15;

-- 7. Seats
INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id) VALUES
('A1', 'A', 1, 'REGULAR', 1), ('A2', 'A', 2, 'REGULAR', 1), ('A3', 'A', 3, 'REGULAR', 1), ('A4', 'A', 4, 'REGULAR', 1), ('A5', 'A', 5, 'REGULAR', 1), ('A6', 'A', 6, 'REGULAR', 1), ('A7', 'A', 7, 'REGULAR', 1), ('A8', 'A', 8, 'REGULAR', 1), ('A9', 'A', 9, 'REGULAR', 1), ('A10', 'A', 10, 'REGULAR', 1), ('A11', 'A', 11, 'REGULAR', 1), ('A12', 'A', 12, 'REGULAR', 1), ('A13', 'A', 13, 'REGULAR', 1), ('A14', 'A', 14, 'REGULAR', 1), ('A15', 'A', 15, 'REGULAR', 1),
('B1', 'B', 1, 'REGULAR', 1), ('B2', 'B', 2, 'REGULAR', 1), ('B3', 'B', 3, 'REGULAR', 1), ('B4', 'B', 4, 'REGULAR', 1), ('B5', 'B', 5, 'REGULAR', 1), ('B6', 'B', 6, 'REGULAR', 1), ('B7', 'B', 7, 'REGULAR', 1), ('B8', 'B', 8, 'REGULAR', 1), ('B9', 'B', 9, 'REGULAR', 1), ('B10', 'B', 10, 'REGULAR', 1), ('B11', 'B', 11, 'REGULAR', 1), ('B12', 'B', 12, 'REGULAR', 1), ('B13', 'B', 13, 'REGULAR', 1), ('B14', 'B', 14, 'REGULAR', 1), ('B15', 'B', 15, 'REGULAR', 1),
('C1', 'C', 1, 'REGULAR', 1), ('C2', 'C', 2, 'REGULAR', 1), ('C3', 'C', 3, 'REGULAR', 1), ('C4', 'C', 4, 'REGULAR', 1), ('C5', 'C', 5, 'REGULAR', 1), ('C6', 'C', 6, 'REGULAR', 1), ('C7', 'C', 7, 'REGULAR', 1), ('C8', 'C', 8, 'REGULAR', 1), ('C9', 'C', 9, 'REGULAR', 1), ('C10', 'C', 10, 'REGULAR', 1), ('C11', 'C', 11, 'REGULAR', 1), ('C12', 'C', 12, 'REGULAR', 1), ('C13', 'C', 13, 'REGULAR', 1), ('C14', 'C', 14, 'REGULAR', 1), ('C15', 'C', 15, 'REGULAR', 1),
('D1', 'D', 1, 'REGULAR', 1), ('D2', 'D', 2, 'REGULAR', 1), ('D3', 'D', 3, 'REGULAR', 1), ('D4', 'D', 4, 'REGULAR', 1), ('D5', 'D', 5, 'REGULAR', 1), ('D6', 'D', 6, 'REGULAR', 1), ('D7', 'D', 7, 'REGULAR', 1), ('D8', 'D', 8, 'REGULAR', 1), ('D9', 'D', 9, 'REGULAR', 1), ('D10', 'D', 10, 'REGULAR', 1), ('D11', 'D', 11, 'REGULAR', 1), ('D12', 'D', 12, 'REGULAR', 1), ('D13', 'D', 13, 'REGULAR', 1), ('D14', 'D', 14, 'REGULAR', 1), ('D15', 'D', 15, 'REGULAR', 1),
('E1', 'E', 1, 'PREMIUM', 1), ('E2', 'E', 2, 'PREMIUM', 1), ('E3', 'E', 3, 'PREMIUM', 1), ('E4', 'E', 4, 'PREMIUM', 1), ('E5', 'E', 5, 'PREMIUM', 1), ('E6', 'E', 6, 'PREMIUM', 1), ('E7', 'E', 7, 'PREMIUM', 1), ('E8', 'E', 8, 'PREMIUM', 1), ('E9', 'E', 9, 'PREMIUM', 1), ('E10', 'E', 10, 'PREMIUM', 1), ('E11', 'E', 11, 'PREMIUM', 1), ('E12', 'E', 12, 'PREMIUM', 1), ('E13', 'E', 13, 'PREMIUM', 1), ('E14', 'E', 14, 'PREMIUM', 1), ('E15', 'E', 15, 'PREMIUM', 1),
('F1', 'F', 1, 'PREMIUM', 1), ('F2', 'F', 2, 'PREMIUM', 1), ('F3', 'F', 3, 'PREMIUM', 1), ('F4', 'F', 4, 'PREMIUM', 1), ('F5', 'F', 5, 'PREMIUM', 1), ('F6', 'F', 6, 'PREMIUM', 1), ('F7', 'F', 7, 'PREMIUM', 1), ('F8', 'F', 8, 'PREMIUM', 1), ('F9', 'F', 9, 'PREMIUM', 1), ('F10', 'F', 10, 'PREMIUM', 1), ('F11', 'F', 11, 'PREMIUM', 1), ('F12', 'F', 12, 'PREMIUM', 1), ('F13', 'F', 13, 'PREMIUM', 1), ('F14', 'F', 14, 'PREMIUM', 1), ('F15', 'F', 15, 'PREMIUM', 1),
('G1', 'G', 1, 'PREMIUM', 1), ('G2', 'G', 2, 'PREMIUM', 1), ('G3', 'G', 3, 'PREMIUM', 1), ('G4', 'G', 4, 'PREMIUM', 1), ('G5', 'G', 5, 'PREMIUM', 1), ('G6', 'G', 6, 'PREMIUM', 1), ('G7', 'G', 7, 'PREMIUM', 1), ('G8', 'G', 8, 'PREMIUM', 1), ('G9', 'G', 9, 'PREMIUM', 1), ('G10', 'G', 10, 'PREMIUM', 1), ('G11', 'G', 11, 'PREMIUM', 1), ('G12', 'G', 12, 'PREMIUM', 1), ('G13', 'G', 13, 'PREMIUM', 1), ('G14', 'G', 14, 'PREMIUM', 1), ('G15', 'G', 15, 'PREMIUM', 1),
('H1', 'H', 1, 'PREMIUM', 1), ('H2', 'H', 2, 'PREMIUM', 1), ('H3', 'H', 3, 'PREMIUM', 1), ('H4', 'H', 4, 'PREMIUM', 1), ('H5', 'H', 5, 'PREMIUM', 1), ('H6', 'H', 6, 'PREMIUM', 1), ('H7', 'H', 7, 'PREMIUM', 1), ('H8', 'H', 8, 'PREMIUM', 1), ('H9', 'H', 9, 'PREMIUM', 1), ('H10', 'H', 10, 'PREMIUM', 1), ('H11', 'H', 11, 'PREMIUM', 1), ('H12', 'H', 12, 'PREMIUM', 1), ('H13', 'H', 13, 'PREMIUM', 1), ('H14', 'H', 14, 'PREMIUM', 1), ('H15', 'H', 15, 'PREMIUM', 1),
('I1', 'I', 1, 'VIP', 1), ('I2', 'I', 2, 'VIP', 1), ('I3', 'I', 3, 'VIP', 1), ('I4', 'I', 4, 'VIP', 1), ('I5', 'I', 5, 'VIP', 1), ('I6', 'I', 6, 'VIP', 1), ('I7', 'I', 7, 'VIP', 1), ('I8', 'I', 8, 'VIP', 1), ('I9', 'I', 9, 'VIP', 1), ('I10', 'I', 10, 'VIP', 1), ('I11', 'I', 11, 'VIP', 1), ('I12', 'I', 12, 'VIP', 1), ('I13', 'I', 13, 'VIP', 1), ('I14', 'I', 14, 'VIP', 1), ('I15', 'I', 15, 'VIP', 1),
('J1', 'J', 1, 'VIP', 1), ('J2', 'J', 2, 'VIP', 1), ('J3', 'J', 3, 'VIP', 1), ('J4', 'J', 4, 'VIP', 1), ('J5', 'J', 5, 'VIP', 1), ('J6', 'J', 6, 'VIP', 1), ('J7', 'J', 7, 'VIP', 1), ('J8', 'J', 8, 'VIP', 1), ('J9', 'J', 9, 'VIP', 1), ('J10', 'J', 10, 'VIP', 1), ('J11', 'J', 11, 'VIP', 1), ('J12', 'J', 12, 'VIP', 1), ('J13', 'J', 13, 'VIP', 1), ('J14', 'J', 14, 'VIP', 1), ('J15', 'J', 15, 'VIP', 1);

INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id)
SELECT seat_number, seat_row, seat_col, seat_type, 2 FROM seats WHERE screen_id = 1;
INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id)
SELECT seat_number, seat_row, seat_col, seat_type, 3 FROM seats WHERE screen_id = 1;
INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id)
SELECT seat_number, seat_row, seat_col, seat_type, 4 FROM seats WHERE screen_id = 1;
INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id)
SELECT seat_number, seat_row, seat_col, seat_type, 5 FROM seats WHERE screen_id = 1;
INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id)
SELECT seat_number, seat_row, seat_col, seat_type, 6 FROM seats WHERE screen_id = 1;
INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id)
SELECT seat_number, seat_row, seat_col, seat_type, 7 FROM seats WHERE screen_id = 1;
INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id)
SELECT seat_number, seat_row, seat_col, seat_type, 8 FROM seats WHERE screen_id = 1;
INSERT INTO seats (seat_number, seat_row, seat_col, seat_type, screen_id)
SELECT seat_number, seat_row, seat_col, seat_type, 9 FROM seats WHERE screen_id = 1;

