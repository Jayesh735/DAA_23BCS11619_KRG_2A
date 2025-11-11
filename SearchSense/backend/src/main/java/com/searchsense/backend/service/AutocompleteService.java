package com.searchsense.backend.service;

import com.searchsense.backend.model.SearchTerm;
import com.searchsense.backend.repository.SearchTermRepository;
import com.searchsense.backend.trie.Trie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional; // <-- This was the missing import

@Service
@RequiredArgsConstructor
public class AutocompleteService {

    private final SearchTermRepository searchTermRepository;
    private final Trie trie = new Trie();

    /**
     * This is called by the DataInitializer to build the Trie
     */
    public void buildTrieFromDatabase() {
        System.out.println(">>> Building the search Trie from database...");
        
        List<SearchTerm> terms = searchTermRepository.findAll();
        
        for (SearchTerm term : terms) {
            trie.insert(term.getTerm());
        }
        
        System.out.println(">>> Trie build complete. " + terms.size() + " terms indexed.");
    }

    /**
     * This is the updated method that returns full, SORTED objects.
     */
    public List<SearchTerm> getAutocompleteSuggestions(String prefix) {
        // 1. Get string suggestions from the ultra-fast Trie
        List<String> stringSuggestions = trie.find(prefix);

        if (stringSuggestions.isEmpty()) {
            return Collections.emptyList(); // Return an empty list if no matches
        }

        // 2. Use the strings to query the database for the full objects
        // This now returns the results pre-sorted by popularity!
        List<SearchTerm> fullTermObjects = 
            searchTermRepository.findByTermInOrderByPopularityDesc(stringSuggestions); 

        return fullTermObjects; 
    }

    /**
     * Finds a term by its string and increments its popularity.
     */
    public void incrementPopularity(String term) {
        // 1. Find the term in the database
        Optional<SearchTerm> optionalTerm = searchTermRepository.findByTerm(term);

        // 2. Check if it exists
        if (optionalTerm.isPresent()) {
            SearchTerm searchTerm = optionalTerm.get();
            
            // 3. Increment the popularity count
            searchTerm.setPopularity(searchTerm.getPopularity() + 1);
            
            // 4. Save the updated term back to the database
            searchTermRepository.save(searchTerm);
        }
        // If the term isn't found, we just do nothing.
    }
}