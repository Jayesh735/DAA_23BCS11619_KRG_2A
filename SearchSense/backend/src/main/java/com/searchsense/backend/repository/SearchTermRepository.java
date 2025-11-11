package com.searchsense.backend.repository;

import com.searchsense.backend.model.SearchTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SearchTermRepository extends JpaRepository<SearchTerm, Long> {

    /**
     * This method now automatically sorts the results
     * by the 'popularity' field in descending order.
     */
    // This is the line that needs to match the service
    List<SearchTerm> findByTermInOrderByPopularityDesc(List<String> terms); 

    // This method finds a single term by its exact string
    Optional<SearchTerm> findByTerm(String term);
}