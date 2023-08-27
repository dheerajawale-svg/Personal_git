using System;
using System.Collections.Generic;
using System.Text;

namespace EventAggregatorLib
{
    public interface IEventAggregator
    {
        void PublishEvent<TEventType>(TEventType eventToPublish);

        void SubsribeEvent(Object subscriber);
    }
}
