(function() {

	// Makes sure we're on the classes page
	function proceed() {
		return window.location.href.indexOf("infocours") > -1;
	}

	// Generates the indexes for the grades positions
	function generateIndexes(size, hasExtraColumn) {
		var indexes = [5];
		var columns = (hasExtraColumn) ? 8 : 7;
		var compensator = (hasExtraColumn) ? 3 : 2;
		for (var i = 1; i < size; i++) {
			indexes.push((i * 5) + columns + ((i - 1) * compensator)); // Don't ask, it works
		}
		return indexes;
	}

	// Splits the grade value with the "/" identifier, returns a trimmed Number array
	function extractGrades(arr) {
		return arr.map(e => { return e.split("/").map(e => { return +e.trim().replace(",", "."); }); });
	}

	// Styles the grade for display
	function gradeFormat(num, isFinalGrade) {
		return (isFinalGrade)
		? Math.round(parseInt(num))
		: parseFloat(Math.round(num * 100) / 100).toFixed(2).replace(".", ",");
	}

	// Main function, displays & handles odd cases
	function buildClassAvg() {
		var classAvg = 0;

		var numOfColumns = $("table.BlueTableau").find("tr").not("tr.TopHeader, tr.Header").length;
		if (numOfColumns > 0) {
			var indexes = generateIndexes(numOfColumns, $("table.BlueTableau tr.Header").html().match("Autres informations") !== null);
			var final_indexes = indexes.map(e => { return e + 1; }); // One "td" away
			var grades = indexes.map(i => { return $("table.BlueTableau").find("tr").not("tr.TopHeader, tr.Header").find("td").eq(i).html() });
			var finalGradesWeight = final_indexes.map(i => { return $("table .BlueTableau").find("tr").not("tr.TopHeader, tr.Header").find("td").eq(i).html() });
			var gradeContent = $(".Panel").first().find("table").last().find("td").html();

			var extractedGrades = extractGrades(grades);
			var extractedWeight = extractGrades(finalGradesWeight).map(e => { return e[1] || e[0]; }); // get only the final grades weight
			
			var totalGradeWeight = 0;

			for (var i = 0; i < extractedWeight.length; i++) {
				if (extractedGrades[i][0] > 0) { // Only proceed if there's a grade
					classAvg += (extractedWeight[i] * extractedGrades[i][0]) / extractedGrades[i][1];
					totalGradeWeight += extractedWeight[i];
				}
			};
			
			if (totalGradeWeight === 100 || classAvg === 0) {
				// All grades are in, no need to show percentage
				gradeContent += "<b> | Moyenne de la classe : " + gradeFormat(classAvg, true) + "</b>";
			} else {
				gradeContent += "<b> | Moyenne de la classe : " + gradeFormat(classAvg, false) + " / " + gradeFormat(totalGradeWeight, false) +
								" (" + gradeFormat((classAvg / totalGradeWeight) * 100, false) + "%) </b>";
			}

			// Puts stuff back into the html
			$(".Panel").first().find("table").last().find("td").html(gradeContent);
		}
	}

	if (proceed())
		buildClassAvg();
})();
