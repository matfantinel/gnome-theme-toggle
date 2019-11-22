const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Ornament = imports.ui.popupMenu.Ornament;
const Util = imports.misc.util;
const St = imports.gi.St;

const CHANGE_FIREFOX_THEME = false;

const CHANGE_ICON_THEME = true;
const ICON_LIGHT_THEME_NAME = "ZorinBlue-Light";
const ICON_DARK_THEME_NAME = "ZorinBlue-Dark";

const CHANGE_SHELL_THEME = true;
const SHELL_LIGHT_THEME_NAME = "ZorinBlue-Light";
const SHELL_DARK_THEME_NAME = "ZorinBlue-Dark";

const LIGHT_THEME_NAME = "ZorinBlue-Light";
const DARK_THEME_NAME = "ZorinBlue-Dark";

function init() {}

function enable() {
    this.mainMenu = Main.panel.statusArea['aggregateMenu'].menu;

    this.themeMenu = new PopupMenu.PopupSubMenuMenuItem("Theme", true);
    this.mainMenu.addMenuItem(themeMenu, 8);
    this.themeMenu.icon.icon_name = "starred-symbolic";

    this.light = new PopupMenu.PopupMenuItem("Light");
    this.light.connect('activate', (item, event) => {
        this.reset_ornament();
        this.set_theme("light");
        item.setOrnament(Ornament.DOT);
    });
    this.themeMenu.menu.addMenuItem(this.light, 0);

    this.dark = new PopupMenu.PopupMenuItem("Dark");
    this.dark.connect('activate', (item, event) => {
        this.reset_ornament();
        this.set_theme("dark");
        item.setOrnament(Ornament.DOT);
    });
    this.themeMenu.menu.addMenuItem(this.dark, 1);

    this.reset_ornament();
}

function set_theme(theme) {    
    set_user_theme(theme == "light" ? LIGHT_THEME_NAME : DARK_THEME_NAME);

    if (CHANGE_SHELL_THEME) {        
        set_gtk_theme(theme == "light" ? SHELL_LIGHT_THEME_NAME : SHELL_DARK_THEME_NAME);
    }
    if (CHANGE_ICON_THEME) {        
        set_icon_theme(theme == "light" ? ICON_LIGHT_THEME_NAME : ICON_DARK_THEME_NAME);
    }

    if (CHANGE_FIREFOX_THEME) {
        set_firefox_theme(theme);        
    }
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

function set_icon_theme(theme) {
    Util.trySpawn(["dconf", "write", "/org/gnome/desktop/interface/icon-theme", "'" + theme +"'"]);
}

function set_firefox_theme(theme) {
    if (theme == LIGHT_THEME_NAME) {
        Util.trySpawn(['/bin/bash', '-c', "cp -rf ~/.mozilla/firefox/7abszo2d.default/chrome/firefox-gnome-theme/userChrome-light.css ~/.mozilla/firefox/7abszo2d.default/chrome/firefox-gnome-theme/userChrome.css"])
    } else {
        Util.trySpawn(['/bin/bash', '-c', "cp -rf ~/.mozilla/firefox/7abszo2d.default/chrome/firefox-gnome-theme/userChrome-dark.css ~/.mozilla/firefox/7abszo2d.default/chrome/firefox-gnome-theme/userChrome.css"])
    }
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
