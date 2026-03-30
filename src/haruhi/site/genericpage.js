((GenericPage) => {
    const { Page } = Haruhi;

    GenericPage.onLoad = async (_) => {
        Page.fadeIn();
    };
})(Haruhi.Site.GenericPage = Haruhi.Site.GenericPage || {});