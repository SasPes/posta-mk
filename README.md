# Macedonian post - Track your item

## Resources
http://posta.com.mk/TrackTrace/index.html
http://www.posta.com.mk/tnt/api/query?id=

## Example
```xml
<ArrayOfTrackingData>
    <TrackingData>
    <ID>RF485517880SG</ID>  
        <Begining>Macedonia ~~(the former Yugoslav Republic of)~~</Begining>
        <End>SKOPJE 1003 OFFICE OF EXCHANGE</End>
        <Date>10/30/2017, 9:27:00 AM</Date>
        <Notice>Receive item at office of exchange (Inb)</Notice>
    </TrackingData>
    <TrackingData>
        <ID>RF485517880SG</ID>
        <Begining>Macedonia ~~(the former Yugoslav Republic of)~~</Begining>
        <End>SKOPJE 1003 OFFICE OF EXCHANGE</End>
        <Date>10/30/2017, 2:20:00 PM</Date>
        <Notice>Send item to domestic location (Inb)</Notice>
    </TrackingData>
    <TrackingData>
        <ID>RF485517880SG</ID>
        <Begining>Kumanovo 1300</Begining>
        <End>1300</End>
        <Date>10/31/2017, 5:37:57 AM</Date>
        <Notice>Vo Posta</Notice>
    </TrackingData>
    <TrackingData>
        <ID>RF485517880SG</ID>
        <Begining>Kumanovo-Dostava 1300</Begining>
        <End>Dostava</End>
        <Date>10/31/2017, 1:04:11 PM</Date>
        <Notice>Ispora~ana</Notice>
    </TrackingData>
</ArrayOfTrackingData>
```