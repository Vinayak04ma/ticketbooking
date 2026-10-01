package com.cfs.BMS.config;

import com.cfs.BMS.entity.*;
import com.cfs.BMS.enums.SeatType;
import com.cfs.BMS.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CityRepository cityRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (cityRepository.count() > 0) {
            log.info("Database already seeded. Skipping DataInitializer.");
            return;
        }

        log.info("Seeding initial database data via JPA...");

        // 1. Cities
        City mumbai = cityRepository.save(City.builder().name("Mumbai").state("Maharashtra").build());
        City delhi = cityRepository.save(City.builder().name("Delhi").state("Delhi").build());
        City bangalore = cityRepository.save(City.builder().name("Bangalore").state("Karnataka").build());
        City hyderabad = cityRepository.save(City.builder().name("Hyderabad").state("Telangana").build());
        City chennai = cityRepository.save(City.builder().name("Chennai").state("Tamil Nadu").build());
        City pune = cityRepository.save(City.builder().name("Pune").state("Maharashtra").build());
        City kolkata = cityRepository.save(City.builder().name("Kolkata").state("West Bengal").build());
        City ahmedabad = cityRepository.save(City.builder().name("Ahmedabad").state("Gujarat").build());

        // 2. Movies
        List<Movie> movies = List.of(
            Movie.builder().title("Pushpa 2: The Rule").description("The rule of Pushpa Raj.").genre("Action").language("Telugu").durationMinutes(165).rating(9.2).releaseDate(LocalDate.of(2024, 12, 5)).posterUrl("https://image.tmdb.org/t/p/original/bhxZj3y59cK7JtGdV285dhDRaMe.jpg").build(),
            Movie.builder().title("Stree 2").description("Sarkata returns to Chanderi.").genre("Horror/Comedy").language("Hindi").durationMinutes(147).rating(8.5).releaseDate(LocalDate.of(2024, 8, 15)).posterUrl("https://image.tmdb.org/t/p/original/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg").build(),
            Movie.builder().title("Kalki 2898 AD").description("The battle for the future.").genre("Sci-Fi/Action").language("Telugu").durationMinutes(181).rating(8.1).releaseDate(LocalDate.of(2024, 6, 27)).posterUrl("https://image.tmdb.org/t/p/original/4P3K5medethmTlsuN7UN5bmnATq.jpg").build(),
            Movie.builder().title("Jawan").description("A social thriller of a man determined to rectify wrongs.").genre("Action").language("Hindi").durationMinutes(169).rating(7.8).releaseDate(LocalDate.of(2023, 9, 7)).posterUrl("https://image.tmdb.org/t/p/original/gTV8RAYEKDcRwn4TFbUZfRk5Nsj.jpg").build(),
            Movie.builder().title("Animal").description("A gripping father-son obsession drama.").genre("Action/Drama").language("Hindi").durationMinutes(201).rating(7.6).releaseDate(LocalDate.of(2023, 12, 1)).posterUrl("https://image.tmdb.org/t/p/original/14zedCaF044yj3at1TJ2uHpaNQD.jpg").build(),
            Movie.builder().title("RRR").description("Tale of two legendary revolutionaries.").genre("Action").language("Telugu").durationMinutes(187).rating(8.7).releaseDate(LocalDate.of(2022, 3, 25)).posterUrl("https://image.tmdb.org/t/p/original/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg").build(),
            Movie.builder().title("Baahubali 2: The Conclusion").description("The epic conclusion to the legendary saga.").genre("Action/Drama").language("Telugu").durationMinutes(167).rating(8.8).releaseDate(LocalDate.of(2017, 4, 28)).posterUrl("https://image.tmdb.org/t/p/original/21sC2assImQIYCEDA84Qh9d1RsK.jpg").build(),
            Movie.builder().title("K.G.F: Chapter 2").description("Rocky’s supremacy challenged.").genre("Action").language("Kannada").durationMinutes(168).rating(8.4).releaseDate(LocalDate.of(2022, 4, 14)).posterUrl("https://image.tmdb.org/t/p/original/au6Nq6kVr9NFICzpmYtMSyDA3Gi.jpg").build(),
            Movie.builder().title("Kantara").description("Justice for the village through ancestral roots.").genre("Action/Drama").language("Kannada").durationMinutes(148).rating(8.2).releaseDate(LocalDate.of(2022, 9, 30)).posterUrl("https://image.tmdb.org/t/p/original/lqkaDoxdKC9PhLtIfAdAVCtQTvM.jpg").build(),
            Movie.builder().title("Vikram").description("Special Ops hunting a masked serial killer.").genre("Action/Thriller").language("Tamil").durationMinutes(175).rating(8.3).releaseDate(LocalDate.of(2022, 6, 3)).posterUrl("https://image.tmdb.org/t/p/original/774UV1aCURb4s4JfEFg3IEMu5Zj.jpg").build(),
            Movie.builder().title("Leo").description("A hero hiding from a dangerous past.").genre("Action").language("Tamil").durationMinutes(164).rating(7.3).releaseDate(LocalDate.of(2023, 10, 19)).posterUrl("https://image.tmdb.org/t/p/original/t1oAdt8JjUs4sHEBvE8fKtjV7er.jpg").build(),
            Movie.builder().title("Jailer").description("A retired jailer goes on a manhunt.").genre("Action").language("Tamil").durationMinutes(168).rating(7.5).releaseDate(LocalDate.of(2023, 8, 10)).posterUrl("https://image.tmdb.org/t/p/original/p933oBZpchdX8KA29gPVKBxGlyU.jpg").build(),
            Movie.builder().title("3 Idiots").description("Chasing excellence with Rancho.").genre("Comedy/Drama").language("Hindi").durationMinutes(170).rating(8.4).releaseDate(LocalDate.of(2009, 12, 25)).posterUrl("https://image.tmdb.org/t/p/original/66A9MqXOyVFCssoloscw79z8Tew.jpg").build(),
            Movie.builder().title("Dangal").description("The wrestling legacy.").genre("Sport/Drama").language("Hindi").durationMinutes(161).rating(8.3).releaseDate(LocalDate.of(2016, 12, 23)).posterUrl("https://image.tmdb.org/t/p/original/3n8888uKuaxPBBuDUqJhfhrWlgA.jpg").build(),
            Movie.builder().title("Pushpa: The Rise").description("The rise of a smuggler.").genre("Action").language("Telugu").durationMinutes(179).rating(7.6).releaseDate(LocalDate.of(2021, 12, 17)).posterUrl("https://image.tmdb.org/t/p/original/oaRk2HgOirEeNuDCwwScmq7rKvS.jpg").build()
        );
        List<Movie> savedMovies = movieRepository.saveAll(movies);

        // 3. Theaters
        Theater tMumbai = theaterRepository.save(Theater.builder().name("PVR Phoenix").address("Lower Parel, Mumbai").city(mumbai).build());
        Theater tDelhi = theaterRepository.save(Theater.builder().name("PVR Director's Cut").address("Vasant Kunj, Delhi").city(delhi).build());
        Theater tBangalore = theaterRepository.save(Theater.builder().name("INOX Mantri Square").address("Malleshwaram, Bangalore").city(bangalore).build());
        Theater tHyderabad = theaterRepository.save(Theater.builder().name("AMB Cinemas").address("Gachibowli, Hyderabad").city(hyderabad).build());
        Theater tChennai = theaterRepository.save(Theater.builder().name("Sathyam Cinemas").address("Royapettah, Chennai").city(chennai).build());
        Theater tPune = theaterRepository.save(Theater.builder().name("Cinepolis Westend").address("Aundh, Pune").city(pune).build());
        Theater tKolkata = theaterRepository.save(Theater.builder().name("INOX Quest Mall").address("Ballygunge, Kolkata").city(kolkata).build());
        Theater tAhmedabad = theaterRepository.save(Theater.builder().name("PVR Acropolis").address("Thaltej, Ahmedabad").city(ahmedabad).build());

        // 4. Screens
        List<Screen> screens = List.of(
            Screen.builder().name("IMAX 1").totalSeats(150).theater(tMumbai).build(),
            Screen.builder().name("Screen 2").totalSeats(150).theater(tMumbai).build(),
            Screen.builder().name("Director's Lounge").totalSeats(150).theater(tDelhi).build(),
            Screen.builder().name("INOX Insignia").totalSeats(150).theater(tBangalore).build(),
            Screen.builder().name("Screen A").totalSeats(150).theater(tHyderabad).build(),
            Screen.builder().name("Main House").totalSeats(150).theater(tChennai).build(),
            Screen.builder().name("VIP Screen 1").totalSeats(150).theater(tPune).build(),
            Screen.builder().name("Screen Elite").totalSeats(150).theater(tKolkata).build(),
            Screen.builder().name("Screen Gold").totalSeats(150).theater(tAhmedabad).build()
        );
        List<Screen> savedScreens = screenRepository.saveAll(screens);

        // 5. Seats for each screen (Rows A-D Regular, E-H Premium, I-J VIP)
        List<Seat> allSeats = new ArrayList<>();
        for (Screen screen : savedScreens) {
            String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
            for (String row : rows) {
                SeatType type = SeatType.REGULAR;
                if (row.compareTo("D") > 0 && row.compareTo("H") <= 0) {
                    type = SeatType.PREMIUM;
                } else if (row.compareTo("H") > 0) {
                    type = SeatType.VIP;
                }
                for (int col = 1; col <= 15; col++) {
                    allSeats.add(Seat.builder()
                        .seatNumber(row + col)
                        .row(row)
                        .col(col)
                        .seatType(type)
                        .screen(screen)
                        .build());
                }
            }
        }
        seatRepository.saveAll(allSeats);

        // 6. Shows
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        List<Show> shows = new ArrayList<>();

        for (int i = 0; i < Math.min(savedMovies.size(), 8); i++) {
            Movie movie = savedMovies.get(i);
            Screen screen = savedScreens.get(i % savedScreens.size());

            shows.add(Show.builder().movie(movie).screen(screen).showDate(today).startTime(LocalTime.of(10, 0)).endTime(LocalTime.of(13, 0)).ticketPrice(350.0).build());
            shows.add(Show.builder().movie(movie).screen(screen).showDate(today).startTime(LocalTime.of(14, 30)).endTime(LocalTime.of(17, 30)).ticketPrice(400.0).build());
            shows.add(Show.builder().movie(movie).screen(screen).showDate(tomorrow).startTime(LocalTime.of(18, 0)).endTime(LocalTime.of(21, 0)).ticketPrice(450.0).build());
        }
        showRepository.saveAll(shows);

        log.info("Database seeding successfully completed with {} movies, {} cities, and {} shows.",
                savedMovies.size(), 8, shows.size());
    }
}
