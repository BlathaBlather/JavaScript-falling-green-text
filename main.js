class HackerScreen {
    constructor(x_cells, y_cells) {
        this.groups = [];

        // Define vertical and horizontal display grid
        this.x_space = x_cells;
        this.y_space = y_cells;

        // Define height of each group and maximum variation
        this.group_height = 10;
        this.group_height_variation = 3;

        // Define probabilty of adding a new3 group each update
        this.probability_add_to_group = 0.25;

        // Define maximum number of groups on display at any time
        this.maximum_groups = 40;

        // Define characters to be used to display
        this.characters = "abcdefghijklmnopqrstuvwxyz";
    }

    /**
     * When run, chance of creating a new group
     */
    add_to_group() {
        let add_new = Math.random() // Probability of adding a new group each update
        if (add_new <= this.probability_add_to_group && this.groups.length < this.maximum_groups) {
            var random_x = Math.floor(Math.random() * this.x_space); // Define random x coord
            var new_group_height = this.group_height + Math.floor(Math.random() * 7) - 3; // Define group height

            var new_characters = this.generateCharacters(new_group_height);

            var new_group = { // Create new group
                height: new_group_height,
                x_pos: random_x,
                y_pos: 0,
                characters: new_characters,
            }

            this.groups.push(new_group) // Add new group to this.groups list

        }
    }

    addIndividualToGroup(x, y) {
        var new_group_height = this.group_height + Math.floor(Math.random() * 7) - 3; // Define group height
        var new_characters = this.generateCharacters(new_group_height);
        var new_group = { // Create new group
            height: new_group_height,
            x_pos: x,
            y_pos: Math.floor(y),
            characters: new_characters,
        }

        this.groups.push(new_group) // Add new group to this.groups list

    }

    generateCharacters(new_group_height) {
        var new_characters = [];

        for (let i = 0; i < new_group_height; i++) { // Add random characters to the group
            new_characters.push(this.characters.charAt(Math.floor(Math.random() *
                this.characters.length)));
        }
        return new_characters;
    }

    /**
     * Gets coordinates of each character to be displayed
     * @returns List of characters with their coords [x,y,character]
     */
    getGroupCharacterCoords() {
        var characters_coords = [];

        for (let i = 0; i < this.groups.length; i++) { // For each group
            var group = this.groups[i];
            var character_coords = [];
            for (let j = group.y_pos; j > group.y_pos - group.height && j >= 0; j--) { // For each character coordinate
                var character = group.characters[(j % group.height)]
                character_coords.push([group.x_pos, j, character])
            }
            characters_coords.push(character_coords)
        }

        return characters_coords
    }

    /**
     * Possibility creating a new group, moves all groups down by one
     */
    move() {
        this.add_to_group() // Add new group each update

        for (let i = 0; i < this.groups.length; i++) { // Update the y_pos for each element
            let element = this.groups[i]
            element.y_pos += 1
        }

        // Remove all groups that have gone past the screen
        var i = this.groups.length
        while (i--) {
            if (this.groups[i].y_pos > (this.y_space + this.groups[i].height)) {
                this.groups.splice(i, 1);
            }
        }

    }
}

class Screen {
    constructor() {

    }
}

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var scale = 10;
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var hackerscreen = new HackerScreen(window.innerWidth / scale, window.innerHeight / scale);


function loop() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    var coords = hackerscreen.getGroupCharacterCoords()
    for (let i = 0; i < coords.length; i++) {
        var coord_group = coords[i];
        for (let j = 0; j < coord_group.length; j++) {
            ctx.fillStyle = "rgba(0, 255, 0, " + String(0.75 - (0.75 * j / coord_group.length)) + ")";
            var coord = coord_group[j]
            ctx.fillRect(coord[0] * 10, coord[1] * 10, scale, scale);
        }
        ctx.font = "10px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        for (let j = 0; j < coord_group.length; j++) {
            ctx.fillStyle = "rgba(255, 255, 255, " + String(0.75 - (0.75 * j / coord_group.length)) + ")";
            var coord = coord_group[j]
            ctx.fillText(coord[2], (coord[0] * scale) + (scale / 2), (coord[1] * scale) + 8);
        }
    }

    hackerscreen.move()

}

var timer = setInterval(loop, 1000 / 15)

window.addEventListener("resize", function () {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    hackerscreen.x_space = window.innerWidth / scale
    hackerscreen.y_space = window.innerHeight / scale
})

c.addEventListener('click', function (event) {
    var cLeft = c.offsetLeft + c.clientLeft;
    var cTop = c.offsetTop + c.clientTop;
    var x = event.pageX - cLeft,
        y = event.pageY - cTop;

    hackerscreen.addIndividualToGroup(x / scale, y / scale)
})