#include<bits/stdc++.h>
using namespace std;

class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        vector<int> freq(26, 0);
        for (char c : tasks)
            freq[c - 'A']++;

        int maxFreq = *max_element(freq.begin(), freq.end());
        int countMax = count(freq.begin(), freq.end(), maxFreq);

        int part1 = (maxFreq - 1) * (n + 1) + countMax;
        return max((int)tasks.size(), part1);
    }
};

int main(){
    return 0;
}