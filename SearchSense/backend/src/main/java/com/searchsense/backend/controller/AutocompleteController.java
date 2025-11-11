package com.searchsense.backend.controller;

import com.searchsense.backend.model.SearchTerm; // [!code ++]
import com.searchsense.backend.service.AutocompleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping; // [!code ++]
import org.springframework.web.bind.annotation.RequestBody; // [!code ++]
import org.springframework.http.ResponseEntity; // [!code ++]
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AutocompleteController {

    private final AutocompleteService autocompleteService;

    @GetMapping("/autocomplete")
    public List<SearchTerm> getAutocomplete(@RequestParam String q) { 
        return autocompleteService.getAutocompleteSuggestions(q);
    }

    /**
     * --- THIS IS OUR NEW ENDPOINT ---
     * Responds to: POST /api/select
     * It takes the selected term (as a plain string) from the request body.
     */
    @PostMapping("/select")
    public ResponseEntity<Void> selectTerm(@RequestBody String term) {
        // We receive the term as a JSON string (e.g., "\"react hooks\"")
        // so we need to clean it by removing the quotes.
        String cleanedTerm = term.replace("\"", "");

        autocompleteService.incrementPopularity(cleanedTerm);
        
        // Return a 200 OK response with no body
        return ResponseEntity.ok().build();
    }
}