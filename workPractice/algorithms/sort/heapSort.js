const TestSortAlgorithm = require("../common/testSortAlgorithm");

/*
========LÝ THUYẾT=========
- Lưu ý là heap sort chỉ là mình tưởng tượng trực quan array là cây nhị phân, chứ 
thật sự mình ko tạo ra cây nào cả, ngta chứng minh đc công thức là với node i, thì
2 thằng con của nó sẽ là 2i + 1 (node con left) và 2i + 2 (node con right).

- Cái hàm heapify (a, N, i) sẽ chỉ chọn node con nào to hơn root (root là thằng
tham số i), và cũng phải là to nhất trong 2 node con (sẽ giải thích vì sao 
bên dưới) để swap giá trị, khi swap xong thì lại đi heapify với vị trí root là 
vị trí node con vừa swap đó (hay còn gọi là chỉ đi vun đống lại bên cây nhị phân 
con đó thôi), sự đặc biệt này sẽ giải thích bên dưới.
VD: cây nhị phân có root hiện tại là số 10, node con bên phải của nó là 7, bên trái là 5, 
thì nó sẽ swap giá trị của root với thằng con bên phải. Và bắt đầu gọi heapify với cây 
có root là thằng con bên phải.

- Chưa bàn về cách max heap được xây dựng như nào, nhưng khi có max heap (max heap 
là cây có node cha luôn to hơn node con), thì bạn tưởng tượng xem, khi mình 
xóa root ra (bằng cách swap giá trị của root và node lá cuối cùng, chính là 
phần tử cuối cùng của array, và sau đó array length trừ đi 1), thì lúc này root 
đang là 1 thằng nhỏ con nào đó. Sau đó mình chọn heapify với root là thằng nhỏ 
con đó, thì hàm này chọn node con lớn nhất để swap (chọn node con lớn nhất để swap 
với root là để thằng root mới to hơn cả 2 node con) và chỉ đi đi vun đống thằng cây 
con bên đó thôi, thằng cây con phía còn lại thì vẫn tuân theo luật là mọi node cha 
lớn hơn node con tại vì nó có bị thay đổi cái gì đâu mà sợ, đây chính là điều đặc biệt. 

=> Đó là lí do vì sao mà bước đầu tiên của heap sort sẽ là build max heap và nó 
phải gọi hàm heapify cho mọi node cha để làm điều đó, vì hàm heapify chỉ vun đống 
lại thành công cho cây đã từng là max heap trước khi remove (remove bản chất chỉ 
là swap) root được thôi. Loop đầu tiên này thì mỗi lần gọi heapify chỉ có tác dụng 
duy nhất, là bảo đảm rằng thằng node cha hiện tại phải to hơn 2 thằng con, thế thôi.
*/

// To heapify a subtree rooted with node i which is
// an index in arr[]. n is size of heap
function heapify(arr, N, i) {
	var largest = i; // Initialize largest as root
	var l = 2 * i + 1; // left = 2*i + 1
	var r = 2 * i + 2; // right = 2*i + 2

	// If left child is larger than root
	if (l < N && arr[l] > arr[largest]) largest = l;

	// If right child is larger than largest so far
	if (r < N && arr[r] > arr[largest]) largest = r;

	// If largest is not root
	if (largest != i) {
		var swap = arr[i];
		arr[i] = arr[largest];
		arr[largest] = swap;

		// Recursively heapify the affected sub-tree
		heapify(arr, N, largest);
	}
}

function sort(arr) {
	var N = arr.length;

	// Build heap (rearrange array)
	/*
	- i đi từ node cha ở dưới cùng và là cuối cùng, cho tới node cha ở bự nhất trên cùng
	- Tại sao lại lại bắt đầu bằng "N/2 -1", công thức node cha cuối cùng chăng?
	=> Mình nghĩ rằng ngta áng chừng, ngta chắc chắn được rằng nút cha cuối cùng chắc chắn nằm trong khoảng 0 -> n/2 - 1. 
	*/
	for (var i = Math.floor(N / 2) - 1; i >= 0; i--) heapify(arr, N, i);

	// One by one extract an element from heap
	for (var i = N - 1; i > 0; i--) {
		// Move current root to end
		var temp = arr[0];
		arr[0] = arr[i];
		arr[i] = temp;

		// call max heapify on the reduced heap
		heapify(arr, i, 0);
	}
}

TestSortAlgorithm(sort);
