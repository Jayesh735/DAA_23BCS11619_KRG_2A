#include <iostream>
using namespace std;

template <typename T>
class Stack {
private:
    T* arr;
    int capacity;
    int topIndex;

public:
    Stack(int size) {
        capacity = size;
        arr = new T[capacity];
        topIndex = -1;
    }

    ~Stack() {
        delete[] arr;
    }

    bool isEmpty() {
        return topIndex == -1;
    }

    bool isFull() {
        return topIndex == capacity - 1;
    }

    void push(T value) {
        if (isFull()) {
            cout << "Stack Overflow! Cannot push " << value << endl;
        } else {
            arr[++topIndex] = value;
            cout << value << " pushed into stack." << endl;
        }
    }

    void pop() {
        if (isEmpty()) {
            cout << "Stack Underflow! Cannot pop." << endl;
        } else {
            cout << arr[topIndex--] << " popped from stack." << endl;
        }
    }

    T top() {
        if (isEmpty()) {
            throw runtime_error("Stack is empty!");
        }
        return arr[topIndex];
    }
};

int main() {
    Stack<int> s(5);
    s.push(100);
    s.push(200);
    s.push(300);
    cout << "Top element is: " << s.top() << endl;
    s.pop();
    cout << "Top element after pop: " << s.top() << endl;
    while (!s.isEmpty()) {
        s.pop();
    }
    s.pop();
    return 0;
}
