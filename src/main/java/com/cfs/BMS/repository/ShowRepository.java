package com.cfs.BMS.repository;

import com.cfs.BMS.entity.Show;
import com.cfs.BMS.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ShowRepository extends JpaRepository<Show,Long> {
    
  List<Show> findByMovieId(Long MovieId);
  List<Show> findByScreenId(Long screenId);
  List<Show> findByMovieIdAndShowDate(Long movieId, LocalDate showDate);
  List<Show> findByScreenIdAndShowDate(Long screenId, LocalDate showDate);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from Show s where s.id = :id")
  Optional<Show> findByIdWithLock(@Param("id") Long id);
}
