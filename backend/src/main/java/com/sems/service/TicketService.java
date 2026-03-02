package com.sems.service;

import com.sems.entity.Ticket;
import java.util.List;

public interface TicketService {
    Ticket bookTicket(Long eventId);

    List<Ticket> getUserTickets();
}
