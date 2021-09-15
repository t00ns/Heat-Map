const svg = d3.select("svg")

svg.attr("width", 800).attr("height", data.length * 150)

// Celsius => Farenheit conversion
// -10 = 14, 0 = 32, 7 = 45, 14 = 58, 21 = 70, 24 = 77
const colorScale = d3
	.scaleLinear()
	.domain([-10, 0, 7, 14, 21, 24])
	.range(["#814ee7", "#3f24ec", "#79e87C", "#fbe157", "#ff9737", "#fe3b3b"])
// the more data you put in the domain & range,
// the easier it'll make the machine think

const boxScale = d3.scaleLinear().domain([-20, 45]).range([150, 0])

const unitScale = d3.scaleLinear().domain([0, 100]).rangeRound([32, 212]) // adding Round makes whole numbers

// line/path generator
const lineGenerator = d3
	.line()
	.x((d, i) => {
		return 225 + 50 * i
	})
	.y((d, i) => {
		return boxScale(d)
	})

const dataPts = svg // makes individual datapoints within a group
	.selectAll("g.datapoint") // only selects the items with a class of "datapoint"
	.data(data)
	.enter() // always enter after data
	.append("g") // copy & paste
	.attr("class", "datapoint")
	.attr("transform", (d, i) => {
		return `translate(0, ${i * 150})`
	}) // let the size rely on the data

// City
dataPts
	.append("text")
	.attr("x", 175)
	.attr("y", 70)
	.attr("class", "city")
	.text((d, i) => {
		return d.city
	})

// Country
dataPts
	.append("text")
	.attr("x", 175)
	.attr("y", 100)
	.attr("class", "country")
	.text((d, i) => {
		return d.country
	})

// Months
const months = dataPts
	.append("g")
	.attr("class", "months")
	.attr("transform", "translate(200, 0)") // b/c it's a group, you can only position it via transform

const monthGroups = months
	.selectAll("g.month")
	.data((d, i) => {
		return d.months
	}) // in order to grab data from another dataset, it can only be pass through a function
	.enter()
	.append("g")
	.attr("class", "months")
	.attr("transform", (d, i) => {
		return `translate(${i * 50}, 0)`
	})

monthGroups
	.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 50)
	.attr("height", 150)
	.style("fill", (d, i) => {
		return colorScale(d)
	}) //uses d (data) via colorScale

monthGroups
	.append("circle")
	.attr("cx", 25)
	.attr("cy", (d, i) => {
		return boxScale(d)
	})
	.attr("r", 18)

const temp = monthGroups
	.append("text")
	.attr("class", "temp")
	.attr("x", 25)
	.attr("y", (d, i) => {
		return boxScale(d)
	})
	.text((d, i) => {
		return d
	})
	.style("fill", (d, i) => {
		return colorScale(d)
	})

dataPts
	.append("path")
	.datum((d, i) => {
		return d.months
	}) // singular data
	.attr("d", (d, i) => {
		return lineGenerator(d)
	})

const selectTag = document.querySelector("select")
selectTag.addEventListener("input", function () {
	if (this.value === "C") {
		temp.text((d, i) => {
			return d
		})
	} else {
		temp.text((d, i) => {
			return unitScale(d)
		})
	}
}) //*code is case-sensitive
