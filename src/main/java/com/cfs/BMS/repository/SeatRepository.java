package com.cfs.BMS.repository;

import com.cfs.BMS.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat,Long> {

  List<Seat> findByScreenId(Long screenId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from Seat s where s.id in :ids")
  List<Seat> findAllByIdWithLock(@Param("ids") List<Long> ids);
}

