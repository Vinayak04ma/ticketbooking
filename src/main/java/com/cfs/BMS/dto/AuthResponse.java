package com.cfs.BMS.dto;

import com.cfs.BMS.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private User user;
}
