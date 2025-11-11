package com.searchsense.backend.config;

import com.searchsense.backend.model.SearchTerm;
import com.searchsense.backend.repository.SearchTermRepository;
import com.searchsense.backend.service.AutocompleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor 
public class DataInitializer implements CommandLineRunner {

    private final SearchTermRepository searchTermRepository;
    private final AutocompleteService autocompleteService;

    @Override
    public void run(String... args) throws Exception {
        
        // Check if database is already populated
        // Because ddl-auto=create, this will always be 0 on startup
        if (searchTermRepository.count() > 0) {
            System.out.println(">>> Database already populated. Building Trie...");
            autocompleteService.buildTrieFromDatabase();
            return;
        }

        // --- NEW DATASET.TXT READING LOGIC ---
        
        System.out.println(">>> Database is empty. Loading data from dataset.txt...");
        List<SearchTerm> termsToSave = new ArrayList<>();

        try {
            ClassPathResource resource = new ClassPathResource("dataset.txt");
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));

            String line; 
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue; // Skip empty lines
                }
                
                // --- THIS IS THE FIX ---
                // Replace all underscores with spaces
                String term = line.trim().replace("_", " "); // [!code ++]
                
                // We'll assign a default category and trending status
                termsToSave.add(new SearchTerm(term, "General", false));
            }
            reader.close();

        } catch (Exception e) {
            System.err.println("!!! Error reading dataset.txt file: " + e.getMessage());
            return; // Don't continue if it fails
        }
        
        // --- END OF NEW LOGIC ---

        // 1. Save all the new terms to the database
        searchTermRepository.saveAll(termsToSave);
        System.out.println(">>> Database initialized with " + termsToSave.size() + " terms from dataset.");

        // 2. NOW, build the Trie from the database
        autocompleteService.buildTrieFromDatabase();
    }
}