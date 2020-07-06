const modal = `
<div class="modal micromodal-slide" id="chartidy-modal" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1" data-micromodal-close>
      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="chartidy-modal-title">
        <header class="modal__header">
          <h2 class="modal__title" id="chartidy-modal-title">
            Enter the column indexes to  interpret in the visualization
          </h2>
        </header>
        <main class="modal__content" id="chartidy-modal-content">
          <form id="chartidy-form">
            <label for="xAxis">X-Axis Column</label>
            <label for="yAxis">Y-Axis Column</label>
            <select name="xAxis" class="select-css"></select>
            <select name="yAxis" class="select-css"></select>
          </form>
          <div id="chartidy-error" />
        </main>
        <footer class="modal__footer">
          <button class="modal__btn" data-micromodal-close aria-label="Close dialog">
            Cancel
          </button>
          <button type="submit" form="chartidy-form"  class="modal__btn modal__btn-primary">
            Done
          </button>
        </footer>
      </div>
    </div>
  </div>
`;

const getIndicesFromForm = (form) => {
  const selectElements = form.getElementsByTagName("select");
  const values = {};
  for (let index = 0; index < selectElements.length; index++) {
    const item = selectElements.item(index);
    values[item.name] = item.value;
  }
  return values;
};

const getTableHeaders = (table) => {
  const tHeads = table.getElementsByTagName("th");
  const array = [];
  for (let index = 0; index < tHeads.length; index++) {
    const item = tHeads.item(index);
    array.push(item.innerText);
  }
  return array;
};

const prepareDataFromTable = (table, axes) => {
  const tableRows = table.getElementsByTagName("tr");
  const rows = [];

  for (let i = 0; i < tableRows.length; i++) {
    const tds = tableRows.item(i).getElementsByTagName("td");
    const xTd = tds.item(axes.xAxis);
    const yTd = tds.item(axes.yAxis);

    if (xTd && yTd) {
      rows.push({
        x: xTd.innerText,
        y: numeral(yTd.innerText).value(),
      });
    }
  }
  return rows;
};

const isDataValid = (data) => !data.some((n) => Number.isNaN(n));

const onSubmit = (e) => {
  e.preventDefault();
  const tableId = e.target.getAttribute("data-id");
  const table = document.getElementById(tableId);
  const values = getIndicesFromForm(e.target);
  const data = prepareDataFromTable(table, values);
  const isValid = isDataValid(data);
  if (isValid) {
    document.getElementById(`${tableId}-chart`).innerHTML = "";
    MicroModal.close("chartidy-modal");
    const tableHeaders = getTableHeaders(table);
    const labels = {
      x: tableHeaders[values.xAxis],
      y: tableHeaders[values.yAxis],
    };
    renderBarChart(`${tableId}-chart`, labels, data, table.clientWidth);
  } else {
    const errorEl = document.getElementById("chartidy-error");
    errorEl.innerHTML = "* Please provide numbers only column as y-axis";
  }
};

window.onload = () => {
  document.body.innerHTML += modal; // Append Modal in the document body
  const tables = document.getElementsByTagName("table");
  const form = document.getElementById("chartidy-form");
  const selectElements = form.getElementsByTagName("select");
  form.onsubmit = onSubmit;

  for (let index = 0; index < tables.length; index++) {
    const table = tables.item(index);
    const tableId = table.getAttribute("id") || `chartidy-${index}`;
    table.setAttribute("id", tableId); // Set table id if it doesn't exists
    const parent = table.parentElement;
    const button = document.createElement("BUTTON"); // Create button element
    button.innerHTML = "Visualize";
    button.setAttribute("data-micromodal-trigger", "chartidy-modal");
    button.setAttribute(
      "class",
      "visualize__btn modal__btn modal__btn-primary",
    );
    parent.insertBefore(button, table); // Insert Visualize button before table
    const chartContainer = document.createElement("div"); // Insert chart container
    chartContainer.setAttribute("id", `${tableId}-chart`);
    parent.appendChild(chartContainer);
    MicroModal.init({
      onShow: () => {
        form.setAttribute("data-id", tableId); // set id of table for which this modal has opened
        const tableHeaders = getTableHeaders(table);

        for (let i = 0; i < selectElements.length; i++) {
          selectElements.item(i).innerHTML = tableHeaders
            .map((th, j) => `<option value="${j}">${th}</option>`)
            .join("");
        }
      },
    });
  }
};
