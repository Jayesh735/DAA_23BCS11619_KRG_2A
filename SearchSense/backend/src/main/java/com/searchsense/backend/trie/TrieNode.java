package com.searchsense.backend.trie;

import java.util.HashMap;
import java.util.HashSet; // We need this
import java.util.Map;
import java.util.Set;     // And this

public class TrieNode {
    
    private final Map<Character, TrieNode> children = new HashMap<>();
    
    /**
     * This replaces 'boolean endOfWord'.
     * It stores all the *original*, full search terms that this node
     * represents the end of.
     * * Example: For the node at the end of "hooks", this set might
     * contain "react hooks tutorial" and "python data hooks".
     */
    private final Set<String> originalTerms = new HashSet<>();

    // --- Getters and Helper Methods ---

    public Map<Character, TrieNode> getChildren() {
        return children;
    }

    public Set<String> getOriginalTerms() {
        return originalTerms;
    }

    /**
     * Adds an original term to this node's set.
     */
    public void addOriginalTerm(String term) {
        originalTerms.add(term);
    }

    /**
     * We can now check if it's an "end of word"
     * by checking if our set is empty.
     */
    public boolean isEndOfWord() {
        return !originalTerms.isEmpty();
    }
}