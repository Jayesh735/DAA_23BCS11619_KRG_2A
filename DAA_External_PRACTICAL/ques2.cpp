#include <bits/stdc++.h>
using namespace std;

class Node {
public:
    int data;
    Node* next;
    
    Node(int val) {
        data = val;
        next = NULL;
    }
};

class Queue {
    Node* front;
    Node* rear;

public:
    Queue() {
        front = rear = NULL;
    }

    bool isEmpty() {
        return front == NULL;
    }

    void enqueue(int x) {
        Node* temp = new Node(x);
        if (rear == NULL) {
            front = rear = temp;
            return;
        }
        rear->next = temp;
        rear = temp;
    }

    void dequeue() {
        if (isEmpty()) return;

        Node* temp = front;
        front = front->next;

        if (front == NULL) rear = NULL; 
        delete temp;
    }

    int peek() {
        if (isEmpty()) return -1;
        return front->data;
    }
    void traverse(){
        Node* curr = front;
        while(curr) {
            cout<<curr->data<<" ";
            curr=curr->next;
        }
    }
};

int main() {
    Queue q;
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    q.traverse();
    cout<<endl;
    cout << q.peek() << "\n";  
    q.dequeue();               
    cout << q.peek() << "\n";
    q.traverse();
}
