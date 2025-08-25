
#include <iostream>
using namespace std;

struct DNode {
    int data;
    DNode *prev, *next;
    DNode(int val) : data(val), prev(nullptr), next(nullptr) {}
};

class DoublyLinkedList {
    DNode* head;

public:
    DoublyLinkedList() : head(nullptr) {}

    void insertAtBeg(int data) {
        DNode* newNode = new DNode(data);
        newNode->next = head;
        if (head) head->prev = newNode;
        head = newNode;
    }

    void insertAtEnd(int data) {
        DNode* newNode = new DNode(data);
        if (!head) {
            head = newNode;
            return;
        }
        DNode* temp = head;
        while (temp->next) temp = temp->next;
        temp->next = newNode;
        newNode->prev = temp;
    }

    void deleteAtBeg() {
        if (!head) return;
        DNode* temp = head;
        head = head->next;
        if (head) head->prev = nullptr;
        delete temp;
    }

    void deleteAtEnd() {
        if (!head) return;
        if (!head->next) {
            delete head;
            head = nullptr;
            return;
        }
        DNode* temp = head;
        while (temp->next) temp = temp->next;
        temp->prev->next = nullptr;
        delete temp;
    }

    void display() {
        DNode* temp = head;
        while (temp) {
            cout << temp->data << " <-> ";
            temp = temp->next;
        }
        cout << "NULL\n";
    }
};

struct CNode {
    int data;
    CNode* next;
    CNode(int val) : data(val), next(nullptr) {}
};

class CircularLinkedList {
    CNode* last;

public:
    CircularLinkedList() : last(nullptr) {}

    void insertAtBeg(int data) {
        CNode* newNode = new CNode(data);
        if (!last) {
            newNode->next = newNode;
            last = newNode;
            return;
        }
        newNode->next = last->next;
        last->next = newNode;
    }

    void insertAtEnd(int data) {
        CNode* newNode = new CNode(data);
        if (!last) {
            newNode->next = newNode;
            last = newNode;
            return;
        }
        newNode->next = last->next;
        last->next = newNode;
        last = newNode;
    }

    void deleteAtBeg() {
        if (!last) return;
        CNode* temp = last->next;
        if (last == last->next) {
            last = nullptr;
            delete temp;
            return;
        }
        last->next = temp->next;
        delete temp;
    }

    void deleteAtEnd() {
        if (!last) return;
        if (last == last->next) {
            delete last;
            last = nullptr;
            return;
        }
        CNode* temp = last->next;
        while (temp->next != last) temp = temp->next;
        temp->next = last->next;
        delete last;
        last = temp;
    }

    void display() {
        if (!last) {
            cout << "List is empty\n";
            return;
        }
        CNode* temp = last->next;
        do {
            cout << temp->data << " -> ";
            temp = temp->next;
        } while (temp != last->next);
        cout << "(back to head)\n";
    }
};

int main() {
    cout << "=== Doubly Linked List Demo ===\n";
    DoublyLinkedList dll;
    dll.insertAtBeg(100);
    dll.insertAtEnd(200);
    dll.insertAtBeg(50);
    dll.insertAtEnd(300);
    cout << "DLL: ";
    dll.display();

    dll.deleteAtBeg();
    dll.deleteAtEnd();
    cout << "DLL after deletion: ";
    dll.display();

    cout << "\n=== Circular Linked List Demo ===\n";
    CircularLinkedList cll;
    cll.insertAtBeg(100);
    cll.insertAtEnd(200);
    cll.insertAtBeg(50);
    cll.insertAtEnd(300);
    cout << "CLL: ";
    cll.display();

    cll.deleteAtBeg();
    cll.deleteAtEnd();
    cout << "CLL after deletion: ";
    cll.display();

    return 0;
}