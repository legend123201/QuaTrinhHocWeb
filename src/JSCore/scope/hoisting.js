function DemoHoisting() {
    c = 10;

    if (c > 2) {
        console.log("Varible c greater than 2!");
    }

    var c;
}

DemoHoisting();