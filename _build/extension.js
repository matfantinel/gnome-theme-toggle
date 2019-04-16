const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Ornament = imports.ui.popupMenu.Ornament;
const Util = imports.misc.util;
const St = imports.gi.St;

const GTK_THEME_NAME = null;
const LIGHT_THEME_NAME = "Adwaita";
const DARK_THEME_NAME = "Adwaita-dark";

function init() {}

function enable() {
    this.mainMenu = Main.panel.statusArea['aggregateMenu'].menu;

    this.themeMenu = new PopupMenu.PopupSubMenuMenuItem("Theme", true);
    this.mainMenu.addMenuItem(themeMenu, 8);
    this.themeMenu.icon.icon_name = "starred-symbolic";

    this.light = new PopupMenu.PopupMenuItem(LIGHT_THEME_NAME);
    this.light.connect('activate', (item, event) => {
        this.reset_ornament();
        this.set_theme(LIGHT_THEME_NAME);
        item.setOrnament(Ornament.DOT);
    });
    this.themeMenu.menu.addMenuItem(this.light, 0);

    this.dark = new PopupMenu.PopupMenuItem(DARK_THEME_NAME);
    this.dark.connect('activate', (item, event) => {
        this.reset_ornament();
        this.set_theme(DARK_THEME_NAME);
        item.setOrnament(Ornament.DOT);
    });
    this.themeMenu.menu.addMenuItem(this.dark, 1);

    this.reset_ornament();
}

function set_theme(theme) {
    if (GTK_THEME_NAME) {
        set_gtk_theme(theme);
    }
    set_user_theme(theme);
    set_theme_label(theme);
    set_firefox_theme(theme);
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
