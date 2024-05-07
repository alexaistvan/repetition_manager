function parseTvSchedule() {
  let tvScheduleInput = document.getElementById("tvScheduleInput").value;
  let programs = tvScheduleInput.split(/\s(?=\d+\.\d+)/);
  let programObjects = programs.map((program) => {
    let [start, title] = program.split(/ (.+)/);
    return { start, title };
  });

  let cleanedProgramObjects = handleRepeatCounter(programObjects);

  displayTvSchedule(cleanedProgramObjects);
}

function handleRepeatCounter(programObjects) {
  let repeatCounter = 1;
  for (let i = 0; i < programObjects.length - 1; i++) {
    if (programObjects[i].title === programObjects[i + 1].title) {
      repeatCounter++;
      if (repeatCounter > 1) {
        programObjects.splice(i + 1, 1);
        i--;
      }
    } else {
      if (repeatCounter > 1) {
        programObjects[i].title += ` (${repeatCounter} rész)`;
      }
      repeatCounter = 1;
    }
  }
  return programObjects;
}

function displayTvSchedule(programObjects) {
  let outputDiv = document.getElementById("longerOutput");
  let shorterOutput = document.getElementById("shorterOutput");
  outputDiv.innerHTML = "";
  shorterOutput.innerHTML = "";

  let outputText = "";
  let outputText2 = "";
  for (let show of programObjects) {
    outputText += `${show.start} ${show.title} `;
    let titleWithoutParentheses = show.title.replace(/\s\(\d+ rész\)/, "");
    outputText2 += `${show.start} ${titleWithoutParentheses} `;
  }
  outputDiv.textContent = outputText.trim();
  shorterOutput.textContent = outputText2.trim();
}
