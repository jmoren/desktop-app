"use strict";

import { app, BrowserWindow, Menu, dialog, ipcMain } from "electron";
import manualUpdater from "./manual_updater";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
let menu;

const menuTemplate = [
  {
    label: app.getName(),
    submenu: [
      {
        label: "Mesas",
        accelerator: "CmdOrCtrl+M",
        click: () => {
          openPage("tables");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Clientes",
        accelerator: "CmdOrCtrl+E",
        click: () => {
          openPage("clients");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Deliveries",
        accelerator: "CmdOrCtrl+D",
        click: () => {
          openPage("deliveries");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Tickets",
        accelerator: "CmdOrCtrl+T",
        click: () => {
          openPage("tickets");
        }
      }
    ]
  },
  {
    label: "Ticket",
    id: "ticket",
    submenu: [
      {
        label: "Cerrar",
        id: "ticket-close",
        enabled: false,
        click: () => {
          sendTicketAction("cerrar ticket");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Imprimir",
        id: "ticket-print",
        enabled: false,
        click: () => {
          sendTicketAction("imprimir ticket");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Imprimir Factura",
        id: "ticket-fiscal",
        enabled: false,
        click: () => {
          sendTicketAction("imprimir ticket fiscal");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Items",
        submenu: [
          {
            label: "Agregar Item",
            enabled: false,
            id: "ticket-item",
            accelerator: "CmdOrCtrl+I",
            click: () => {
              sendTicketAction("agregar item");
            }
          },
          {
            type: "separator"
          },
          {
            label: "Agregar Promocion",
            enabled: false,
            id: "ticket-promotion",
            accelerator: "CmdOrCtrl+O",
            click: () => {
              sendTicketAction("agregar promocion");
            }
          },
          {
            type: "separator"
          },
          {
            label: "Agregar Adicional",
            enabled: false,
            id: "ticket-additional",
            accelerator: "CmdOrCtrl+A",
            click: () => {
              sendTicketAction("agregar adicional");
            }
          }
        ]
      },
      {
        type: "separator"
      },
      {
        label: "Mesa",
        submenu: [
          {
            label: "Cambiar Mesa",
            enabled: false,
            id: "ticket-table",
            click: () => {
              sendTicketAction("cambiar de mesa");
            }
          },
          {
            type: "separator"
          },
          {
            label: "Enviar como delivery",
            enabled: false,
            id: "ticket-remove-table",
            click: () => {
              sendTicketAction("cambiar delivery");
            }
          }
        ]
      },
      {
        type: "separator"
      },
      {
        label: "Cliente",
        submenu: [
          {
            label: "Asignar cliente",
            enabled: false,
            id: "ticket-client",
            click: () => {
              sendTicketAction("cambiar cliente");
            }
          },
          {
            type: "separator"
          },
          {
            label: "Elimnar el cliente",
            enabled: false,
            id: "ticket-remove-client",
            click: () => {
              sendTicketAction("eliminar cliente");
            }
          }
        ]
      }
    ]
  },
  {
    label: "Buscar",
    submenu: [
      {
        label: "Clientes",
        accelerator: "CmdOrCtrl+L",
        click: () => {
          openPage("search");
        }
      }
    ]
  },
  {
    label: "Administracion",
    submenu: [
      {
        label: "Usuarios",
        accelerator: "CmdOrCtrl+U",
        click: () => {
          openPage("Usuarios");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Reportes",
        accelerator: "CmdOrCtrl+T",
        click: () => {
          openPage("Reportes");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Productos",
        accelerator: "CmdOrCtrl+P",
        click: () => {
          openPage("Productos");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Configuaracion",
        accelerator: "CmdOrCtrl+F",
        click: () => {
          openPage("Configuracion");
        }
      }
    ]
  },
  {
    label: "Info",
    submenu: [
      {
        label: "About",
        click: () => {
          dialog.showMessageBox({
            type: "none",
            buttons: ["Cerrar"],
            title: "About",
            message: "Bar Manager 3.0",
            detail:
              "Sistema integral para administrar tu restaurante, bar, pizzeria, etc..."
          });
        }
      },
      {
        type: "separator"
      },
      {
        label: "Actualizaciones",
        click: () => {
          manualUpdater.checkForUpdates(mainWindow);
        }
      },
      {
        type: "separator"
      },
      {
        label: "Salir",
        role: "quit"
      }
    ]
  },
  {
    label: "Dev",
    submenu: [
      {
        label: "DevTools",
        role: "toggledevtools"
      }
    ]
  }
];

const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    backgroundColor: "#E4E7ED",
    width: 1224,
    height: 1024
  });

  // Add menu
  menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  mainWindow.setMenu(menu);

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.on("toggle-ticket-menu", () => {
  toggleTicketMenu();
});

function toggleTicketMenu() {
  const items = [
    "ticket-close",
    "ticket-print",
    "ticket-client",
    "ticket-fiscal",
    "ticket-table",
    "ticket-remove-client",
    "ticket-remove-table",
    "ticket-item",
    "ticket-promotion",
    "ticket-additional"
  ];
  for (var i = items.length - 1; i >= 0; i--) {
    let id = items[i];
    let item = menu.getMenuItemById(id);
    item.enabled = !item.enabled;
  }
}

function sendTicketAction(action) {
  mainWindow.webContents.send("ticket-action", action);
}

function openPage(page) {
  if (page === "search") {
    mainWindow.webContents.send("open-search");
  } else if (page === "clients") {
    mainWindow.webContents.send("open-page", page);
  } else if (page === "tables") {
    mainWindow.webContents.send("open-page", page);
  } else {
    console.log(`Open page: ${page}`);
  }
}

function startListenerUpdater() {
  ipcMain.on("ready-to-messages", () => {
    manualUpdater.checkForUpdates(mainWindow);
  });

  ipcMain.on("install-updates", (event, args) => {
    if (process.env.NODE_ENV === "development") {
      app.quit();
    } else {
      manualUpdater.confirm();
    }
  });
}

app.on("ready", () => {
  startListenerUpdater();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
