package com.cfs.BMS.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiateResponse {
    private Long bookingId;
    private String clientSecret;
    private Double baseAmount;
    private Double gst;
    private Double totalAmount;
    private String publicKey;
}
