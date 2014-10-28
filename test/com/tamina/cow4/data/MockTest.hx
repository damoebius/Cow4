import com.tamina.cow4.model.Cell;
import com.tamina.cow4.data.Mock;
import haxe.unit.TestCase;

class MockTest extends TestCase {

    var mock:Mock;

    override public function setup() {
        mock = Mock.instance;
        Reflect.setField(mock, 'row', 10);
        Reflect.setField(mock, 'column', 10);
        Reflect.setField(mock, 'goRight', true);
    }

    public function testFillCell(){

        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [null, 1]);
        assertTrue(cell.left == null);

        var cellCase5 = new Cell();
        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [cellCase5, 5]);
        assertTrue(cell.left == cellCase5);

        var cellCase11 = new Cell();
        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [cellCase11, 11]);
        assertTrue(cell.top == cellCase11);
        assertFalse(Reflect.field(mock, 'goRight'));

        var cellCase15 = new Cell();
        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [cellCase15, 15]);
        assertTrue(cell.right == cellCase15);

        var cellCase21 = new Cell();
        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [cellCase21, 21]);
        assertTrue(cell.top == cellCase21);
        assertTrue(Reflect.field(mock, 'goRight'));

    }
}
