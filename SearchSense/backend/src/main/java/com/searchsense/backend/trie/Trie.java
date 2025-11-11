package com.searchsense.backend.trie;

import java.util.ArrayList;
import java.util.HashSet; // We need this
import java.util.List;
import java.util.Set;     // And this

public class Trie {

    private final TrieNode root;

    public Trie() {
        // The root node is always empty
        root = new TrieNode();
    }

    /**
     * Inserts an original search term into the trie.
     * It splits the term into individual words and inserts each one.
     */
    public void insert(String originalTerm) {
        String[] words = originalTerm.toLowerCase().split("\\s+"); // Split by whitespace

        // Insert each word from the original term
        for (String word : words) {
            if (word.isEmpty()) continue;

            TrieNode current = root;
            // Iterate over each character in the word
            for (char ch : word.toCharArray()) {
                current = current.getChildren().computeIfAbsent(ch, c -> new TrieNode());
            }
            // At the end node for this word, add the *original* full term
            current.addOriginalTerm(originalTerm);
        }
    }

    /**
     * Finds all *original terms* that contain a word
     * starting with the given prefix.
     */
    public List<String> find(String prefix) {
        // Use a Set to store unique original terms
        Set<String> uniqueOriginalTerms = new HashSet<>();
        TrieNode current = root;
        
        // 1. Navigate the trie to the end of the prefix
        for (char ch : prefix.toLowerCase().toCharArray()) {
            TrieNode node = current.getChildren().get(ch);
            if (node == null) {
                // If the prefix isn't in the trie, return an empty list
                return new ArrayList<>(); 
            }
            current = node;
        }

        // 2. At the prefix node, find all original terms in all child nodes
        findAllOriginalTermsFromNode(current, uniqueOriginalTerms);

        return new ArrayList<>(uniqueOriginalTerms);
    }

    /**
     * A recursive helper method to find all original terms from a given node
     * and all its descendants.
     */
    private void findAllOriginalTermsFromNode(TrieNode node, Set<String> uniqueOriginalTerms) {
        // 1. Add all original terms from the *current* node
        // (This handles cases where the prefix itself is a complete word)
        uniqueOriginalTerms.addAll(node.getOriginalTerms());

        // 2. Recursively check all children
        for (TrieNode childNode : node.getChildren().values()) {
            findAllOriginalTermsFromNode(childNode, uniqueOriginalTerms);
        }
    }
}