function parseTvSchedule() {
  let tvScheduleInput = document.getElementById("tvScheduleInput").value;
  let programs = tvScheduleInput.split(/\s(?=\d+\.\d+)/);
  let specialChars = /[ｦｧｨｩｰｱｲｳｴｵｶｷｸ]/;

  let programObjects = programs.map((program) => {
    let [start, title] = program.split(/ (.+)/);

    title = title.replace(/ - /g, " – ");
    if (/:\s[a-zA-Z]/.test(title)) {
      title = title.replace(
        /:\s(\w)/,
        (_, letter) => `: ${letter.toUpperCase()}`
      );
    }

    // a címben van e speciális karakter
    let match = title.match(specialChars);
    if (match) {
      title = title.replace(specialChars, ""); // a speci karakter eltávolítása a címből
      title += ` ${match[0]}`; // majd hozzá adása a cím végére.
    }

    return { start, title };
  });

  let cleanedProgramObjects = handleRepeatCounter(programObjects, specialChars);

  displayTvSchedule(cleanedProgramObjects);
}

function handleRepeatCounter(programObjects, specialChars) {
  let repeatCounter = 1;
  for (let i = 0; i < programObjects.length - 1; i++) {
    let titleWithoutSpecialChars = programObjects[i].title.replace(
      specialChars,
      ""
    );
    let nextTitleWithoutSpecialChars = programObjects[i + 1].title.replace(
      specialChars,
      ""
    );

    if (titleWithoutSpecialChars === nextTitleWithoutSpecialChars) {
      repeatCounter++;
      if (repeatCounter > 1) {
        programObjects.splice(i + 1, 1);
        i--;
      }
    } else {
      if (repeatCounter > 1) {
        let specialCharMatch = programObjects[i].title.match(specialChars);
        if (specialCharMatch) {
          programObjects[i].title = programObjects[i].title.replace(
            specialChars,
            ""
          ); // speci karakter eltávolítása a címből
          programObjects[
            i
          ].title += ` (${repeatCounter} rész) ${specialCharMatch[0]}`; // zárójel utáni karakter hozzá adása
        } else {
          programObjects[i].title += ` (${repeatCounter} rész)`;
        }
      }
      repeatCounter = 1;
    }
  }
  if (repeatCounter > 1) {
    let lastProgram = programObjects[programObjects.length - 1];
    let specialCharMatch = lastProgram.title.match(specialChars);
    if (specialCharMatch) {
      lastProgram.title = lastProgram.title.replace(specialChars, "");
      lastProgram.title += ` (${repeatCounter} rész)${specialCharMatch[0]}`;
    } else {
      lastProgram.title += ` (${repeatCounter} rész)`;
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
    // zárójel eltávolítása v2ben
    let titleWithoutParentheses = show.title.replace(
      /\s\(\d+ rész\)[ｦｧｨｩｰｱｲｳｴｵｶｷｸ]?/,
      ""
    );
    outputText2 += `${show.start} ${titleWithoutParentheses} `;
  }
  outputDiv.textContent = outputText.trim();
  shorterOutput.textContent = outputText2.trim();
}

//refresh
let refreshBtn = document.getElementById("btnRefresh");

function handleClick() {
  window.location.reload();
}

refreshBtn.addEventListener("click", handleClick);
