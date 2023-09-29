const svg_size = '19px'

/**
 * Handles replacing the default folder icon with new dynamic ones, depending on the folder name
 * @date 29/09/2023 - 16:46:32
 *
 * @param {*} row
 * @param {string} row_item_name
 */
const renderFolderIcon = (row, row_item_name) => {
  const new_svg_elem = document.createElement("img");
  new_svg_elem.setAttribute('height', svg_size)

  folderIcons.forEach(folderIcon => {
    if (folderIcon.names.includes(row_item_name.toLowerCase())) {
      new_svg_elem.setAttribute("src", chrome.runtime.getURL(`icons/${folderIcon.icon}.svg`))
      const default_svg_elem = row.querySelector('div:nth-child(1) > svg')
      default_svg_elem?.replaceWith(new_svg_elem)
    }
  })
}

/**
 * Handles replacing default file icon with dynamic ones, depending on filename, extension etc
 * @date 29/09/2023 - 16:58:22
 *
 * @param {*} row
 * @param {string} row_item_name
 */
const renderFileIcon = (row, row_item_name) => {
  const new_svg_elem = document.createElement("img");
  new_svg_elem.setAttribute('height', svg_size)

  // render icons for absolutes
  // absolutes icons are icons that their names must match up letter for letter else they could coincide with other icons
  // e.g package.json could coincide with ***.json - For this, we'd want to show nodejs icon isntead of json
  fileIcons_absolutes.forEach(fileIcon => {
    if (fileIcon.names.includes(row_item_name)) {
      new_svg_elem.setAttribute("src", chrome.runtime.getURL(`icons/${fileIcon.icon}.svg`))
      const default_svg_elem = row.querySelector('div:nth-child(1) > svg')
      default_svg_elem?.replaceWith(new_svg_elem)
    }
  });
  // done with absolutes

  // extract and store absolute icon names in an array for cross-referencing
  // we want to make sure icons we are dealing with now are not absolutes
  const absolute_names = []
  fileIcons_absolutes.map(icon => absolute_names.push(...icon.names))

  if (!absolute_names.includes(row_item_name)) {
    fileIcons.forEach(fileIcon => {
      fileIcon.names.forEach(iconname => {
        if (row_item_name.includes(iconname)) {
          new_svg_elem.setAttribute("src", chrome.runtime.getURL(`icons/${fileIcon.icon}.svg`))
          const default_svg_elem = row.querySelector('div:nth-child(1) > svg')
          default_svg_elem?.replaceWith(new_svg_elem)
        }
      })
    })
  }
}



$(document).ready(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.request == "load-icons") {
      // only github repos have code tab, we use that to check if current page is a repo
      const codetab = document.querySelector('#code-tab')
      if (codetab) {
        const repo_files = document.querySelector('.js-navigation-container')
        const rows = repo_files.querySelectorAll('.Box-row')
        rows.forEach(row => {
          const row_item_name = row.querySelector('div:nth-child(2) > span > a').innerText
          const default_svg_elem = row.querySelector('div:nth-child(1) > svg')
          const default_svg_elem_class = default_svg_elem.getAttribute('class')

          // check if icon is a folder or a file. This determines how we handle dynamically rendering files and folders
          if (default_svg_elem_class.includes('octicon-file-directory-fill')) renderFolderIcon(row, row_item_name)
          else renderFileIcon(row, row_item_name)
        })
      }
    }
  });
});