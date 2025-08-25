#include<iostream>
#include<vector>
#include<map>
using namespace std;

vector<vector<int>> countFreq(vector<int> &arr) {
    map<int, int>mp;
    for(int i = 0; i < arr.size(); i++){
        mp[arr[i]]++;
    }
    vector<vector<int>>ans;
    for(auto it  : mp){
        ans.push_back({it.first, it.second});
    }
    return ans;
}

int main() {
    vector<int> arr = { 1, 2, 2, 4 };
    vector<vector<int>> ans = countFreq(arr);
    
    for(int i = 0; i < ans.size(); i++) {
        for(int j = 0; j < ans[i].size(); j++) {
            cout<<ans[i][j]<<' ';
        }
        cout<<endl;
    }
    
    return 0;
}