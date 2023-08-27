using System;
using System.Collections.Generic;
using System.Text;

namespace EventAggregatorLib
{
    public interface ISubscriber<TEventType>
    {
        void OnEventHandler(TEventType e);
    }
}
