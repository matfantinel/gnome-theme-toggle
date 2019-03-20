const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Ornament = imports.ui.popupMenu.Ornament;
const Util = imports.misc.util;
const St = imports.gi.St;

const LIGHT_THEME_NAME = "AdwaitaRefresh";
const DARK_THEME_NAME = "AdwaitaRefresh-dark";

function init() {}

function enable() {
    this.mainMenu = Main.panel.statusArea['aggregateMenu'].menu;

    this.themeMenu = new PopupMenu.PopupSubMenuMenuItem("Theme", true);
    this.mainMenu.addMenuItem(themeMenu, 8);
    this.themeMenu.icon.icon_name = "starred-symbolic";

    this.light = new PopupMenu.PopupMenuItem("Light");
    this.light.connect('activate', (item, event) => {
        this.reset_ornament();
        this.set_theme(LIGHT_THEME_NAME);
        item.setOrnament(Ornament.DOT);
    });
    this.themeMenu.menu.addMenuItem(this.light, 0);

    this.dark = new PopupMenu.PopupMenuItem("Dark");
    this.dark.connect('activate', (item, event) => {
        this.reset_ornament();
        this.set_theme(DARK_THEME_NAME);
        item.setOrnament(Ornament.DOT);
    });
    this.themeMenu.menu.addMenuItem(this.dark, 1);

    this.reset_ornament();
}

function set_theme(theme) {
    // set_gtk_theme(theme);
    set_user_theme(theme);
    set_theme_label(theme);
}

function set_theme_label(theme){
    this.themeMenu.label.text = theme;
}

function set_gtk_theme(theme) {
    Main.setThemeStylesheet("/usr/share/themes/"+theme+"/gnome-shell/gnome-shell.css");
    Main.loadTheme();
    Util.trySpawn(["dconf", "write", "/org/gnome/shell/extensions/user-theme/name", "'" + theme +"'"]);
}

function set_user_theme(theme) {
    Util.trySpawn(["dconf", "write", "/org/gnome/desktop/interface/gtk-theme", "'" + theme +"'"]);
}

function reset_ornament() {
    this.light.setOrnament(Ornament.NONE);
    this.dark.setOrnament(Ornament.NONE);
}

function disable() {
    if (this.light) {
        this.light.destroy();
        this.light = 0;
    }

    if (this.dark) {
        this.dark.destroy();
        this.dark = 0;
    }

    if (this.themeMenu) {
        this.themeMenu.destroy();
        this.themeMenu = 0;
    }
}
