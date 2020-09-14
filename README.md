# interactive-maps

Build interactive webmaps using Mapbox and a content management system.

## Development

When editing the admin interface, for hot reloading:

```
npm run start:admin
```

When editing the map interface:

```
npm run start:map
```

For deploying

```
npm run build
http-server dist
```

## Troubleshooting


* **Layer failures.** A layer could fail to fade in or out or appear altogether. This could be caused by a miryad of reasons. The map will still function with the error, but the layers that fail won't look as originally intended.

  * *Can't get layer visibility.* The CMS allows you to specify which layers are visible at a particular zoom level of the story. We try to be smart and fetch the layer opacity from mapbox. If we can't get the layer opacity, the layer may not fade in or out as intended. 
  * *Layer no longer exists.* One main reason this could happen is if the Mapbox style is updated without updating the CMS. The CMS won't know about the new layers that are available. The CMS needs to be updated after the Mapbox style is updated somehow; you can do this now manually by opening up a section and adding the new layer to the 'visible layers' box. 
  * *Debugging.* There should be error messages in the console in case a layer fails to fade in or out; although we may not be able to detect exactly the reason why a layer failed to render, it can give some helpful contextr. These errors will be shown in the Developer Console (Cmd+Shift+I).

* **Layer transition smoothness.** Before publishing, find which layers should be hidden between transitions and add them to the hidden layers in [`src/map_transition.js`](https://github.com/digidem/sinangoe-webmap/blob/master/src/map_transition.js#L14). This is a delicate choice, because if you hide too many layers, it'll look very rigid and not very smooth visually when scrolling. However, if you hide too few, it'll be very slow overall and hard to view on slow internet connection and older computers.





