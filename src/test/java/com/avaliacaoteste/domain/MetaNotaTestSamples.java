package com.avaliacaoteste.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class MetaNotaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static MetaNota getMetaNotaSample1() {
        return new MetaNota().id(1L).area("area1").meta(1);
    }

    public static MetaNota getMetaNotaSample2() {
        return new MetaNota().id(2L).area("area2").meta(2);
    }

    public static MetaNota getMetaNotaRandomSampleGenerator() {
        return new MetaNota().id(longCount.incrementAndGet()).area(UUID.randomUUID().toString()).meta(intCount.incrementAndGet());
    }
}
