const LIST_SYMBOLS = {
	0: "-",
	1: "+",
	2: "*",
};

const extractLinkLabel = (text) => {
	const linkExp = /^(?:#+)\s\[.+\]\(.+\)/;

	if (linkExp.test(text)) {
		return text.match(/^(?:#+)\s(?:\[)(.+)(?:\])/)[0];
	}

	return text;
};

const cleanUpLine = (line) => {
	const extractedLine = extractLinkLabel(line);

	// Remove all characters that are not digits except # and spaces
	const invalidExp = /[^#\w\s]/g;

	//Remove duplicated space
	const spaceExp = /\s{2,}/g;

	return extractedLine.replace(invalidExp, "").replace(spaceExp, " ");
};

const slugify = (str) =>
	str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");

const copyText = () => {
	const output = document.getElementById("output");

	navigator.clipboard.writeText(output.value);
};

window.addEventListener("DOMContentLoaded", () => {
	const submitButton = document.querySelector("button[type=submit]");

	submitButton.addEventListener("click", (event) => {
		event.preventDefault();

		const inputValue = document.getElementById("input").value;
		const output = document.getElementById("output");

		const lines = inputValue.split("\n");
		const headingExp = /^(#+)\s/gm;

		const tocLines = lines.reduce((headings, line) => {
			const cleanLine = cleanUpLine(line);

			if (headingExp.test(cleanLine)) {
				const level = cleanLine.match(/#/g).length - 1;
				const listSymbol = LIST_SYMBOLS[level % 3];
				const replacedContent = cleanLine.replace(headingExp, "");
				const slug = slugify(cleanLine);

				link = `${[...Array(level * 2).keys()]
					.fill(" ")
					.join("")}${listSymbol} [${replacedContent}](#${slug})`;

				return [...headings, link];
			}

			return headings;
		}, []);

		output.value = tocLines.join("\n");
	});
});
