import { quickSort, mergeSort } from '../../time-complexity/script.js';

const Tree = (arr) => {
    // Create Node Function
    const createNode = (data, left = null, right = null) => ({ data, left, right });

    // Midpoint Helper
    const getMidpoint = (start, end) => start + Math.floor((end - start) / 2);

    // Remove Duplicates and Sort Array
    arr = mergeSort(Array.from(new Set(arr)));

    // Build Tree Recursively
    const buildTree = (array, start, end) => {
        if (start > end) return null;
        const m = getMidpoint(start, end);
        return createNode(array[m], buildTree(array, start, m - 1), buildTree(array, m + 1, end));
    };

    // Get Root
    let root = buildTree(arr, 0, arr.length - 1);

    // Pretty Print
    const prettyPrint = (node = root, prefix = "", isLeft = true) => {
        if (node === null) return;
        if (node.right !== null) prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null) prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    };

    // Find Item in Tree
    const findItem = (val, node = root) => {
        if (!node) return false;
        if (node.data === val) return true;
        return node.data > val ? findItem(val, node.left) : findItem(val, node.right);
    };

    // Check if the tree is balanced (difference between left and right nodes is no more than 1)
    const isBalanced = (node = root) => {
        const checkHeight = (node) => {
            if (!node) return 0;

            const left = checkHeight(node.left);
            if (left === -1) return -1;

            const right = checkHeight(node.right);
            if (right === -1) return -1;

            if (Math.abs(left - right) > 1) return -1;

            return 1 + Math.max(left, right);
        };

        return checkHeight(node) !== -1;
    };

    const rebalanceTree = () => {
        if (isBalanced()) return;

        const getSortedArray = (node = root, result = []) => {
            if (!node) return result;
            getSortedArray(node.left, result);
            result.push(node.data);
            getSortedArray(node.right, result);
            return result;
        };

        const sortedArray = getSortedArray();

        root = buildTree(sortedArray, 0, sortedArray.length - 1);
    };

    // Insert into Tree
    const insertItem = (val) => {
        if (findItem(val)) {
            console.error('Value already in tree. No duplicates.');
            return;
        };

        const newNode = createNode(val);

        if (!root) root = newNode;

        const getParent = (node) => {
            if (!node) return null;

            if (node.data > val) {
                if (!node.left) return node;
                return getParent(node.left);
            };

            if (node.data < val) {
                if (!node.right) return node;
                return getParent(node.right);
            };
        };

        const parentNode = getParent(root);

        if (!parentNode) return;

        if (parentNode.data > val) {
            parentNode.left = newNode;
        } else {
            parentNode.right = newNode;
        };
    };

    // Delete from Tree
    const deleteItem = (val) => {
        if (!findItem(val)) {
            console.error('Item not in tree');
            return;
        };

        const getParent = (node, parentNode) => {
            if (!node) return null;
            if (node.data === val) return parentNode;
            return node.data > val ? getParent(node.left, node) : getParent(node.right, node);
        };

        const parentNode = getParent();
        const isLeft = parentNode ? parentNode.data > val : false;

        const nodeToDelete = parentNode ? (isLeft ? parentNode.left : parentNode.right) : root;

        if (!nodeToDelete || nodeToDelete.data !== val) return;

        const { left, right } = nodeToDelete;

        if (!left && !right) {
            if (!parentNode) root = null;
            else if (isLeft) parentNode.left = null;
            else parentNode.right = null;
        };

        if (!left || !right) {
            const child = left || right;
            if (!parentNode) root = child;
            else if (isLeft) parentNode.left = child;
            else parentNode.right = child;
        };

        const findSuccessor = (node) => {
            let successorParent = node;
            let successorNode = node.right;

            while (successorNode.left) {
                successorParent = successorNode;
                successorNode = successorNode.left;
            };

            return { successorParent, successorNode };
        };

        const { successorParent, successorNode } = findSuccessor(nodeToDelete);

        nodeToDelete.data = successorNode.data;

        if (successorParent === nodeToDelete) {
            successorParent.right = successorNode.right;
        } else {
            successorParent.left = successorNode.right;
        };

        rebalanceTree();
    };

    // Level Order Traversal
    const levelOrder = (callback) => {
        if (!root) return null;
        const queue = [root];

        while (queue.length) {
            const curr = queue.shift();
            callback(curr);
            if (curr.left) queue.push(curr.left);
            if (curr.right) queue.push(curr.right);
        };
    };

    const reversedLevelOrder = (callback) => {
        if (!root) return null;
        const queue = [root];
        const stack = [];

        while (queue.length) {
            const curr = queue.shift();
            stack.push(curr);
            if (curr.right) queue.push(curr.right);
            if (curr.left) queue.push(curr.left);
        };

        while (stack.length) {
            callback(stack.pop());
        }
    };

    const isMirrored = (root) => {
        if (!root) return false;

        const isSymmetrical = (root1, root2) => {
            if (!root1 && !root2) return true;

            if (!root1 || !root2) return false;

            if (root1.data !== root2.data) return false;

            return isSymmetrical(root1.left, root2.right) && isSymmetrical(root1.right, root2.left);
        };

        return isSymmetrical(root.left, root.right);
    };

    // Log Items in Order (LDR)
    const inOrder = (callback) => {
        const traverse = (node) => {
            if (!node) return;
            callback(node);
            traverse(node.left);
            traverse(node.right);
        };
        traverse(root);
    };

    // Log Items Pre Order (DLR)
    const preOrder = (callback) => {
        const traverse = (node) => {
            if (!node) return;
            traverse(node.left);
            callback(node);
            traverse(node.right);
        };
        traverse(root);
    };

    // Log Items Post Order (LRD)
    const postOrder = (callback) => {
        const traverse = (node) => {
            if (!node) return;
            traverse(node.left);
            traverse(node.right);
            callback(node);
        };
        traverse(root);
    };

    // Find the Depth. Defined number of edges from the root to a given node
    const depth = (target, node = root) => {
        if (!node) return -1;
        if (node.data === target) return 0;

        const left = depth(target, node.left);
        if (left !== -1) return left + 1;

        const right = depth(target, node.right);
        if (right !== -1) return right + 1;

        return Math.max(left, right);
    };

    // Find the Height. Defined as the number of Edges from the leaf (bottom-most null) to the root.
    const height = (node = root) => node ? 1 + Math.max(height(node.left), height(node.right)) : 0;

    return {
        root,
        prettyPrint,
        insertItem,
        deleteItem,
        findItem,
        levelOrder,
        inOrder,
        preOrder,
        postOrder,
        depth,
        height,
        isBalanced,
        rebalanceTree,
    }
};

const driverScript = () => {
    const array = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
    const tree = Tree(array);
    console.log(tree.isBalanced())
    const newArray = Array.from({ length: 10 }, () => Math.floor(100 + (Math.random() * 100)));
    console.table(newArray);
    newArray.forEach(value => tree.insertItem(value));
    console.log(tree.isBalanced());
    tree.rebalanceTree();
    console.log(tree.isBalanced());
    tree.prettyPrint()
};

driverScript();
